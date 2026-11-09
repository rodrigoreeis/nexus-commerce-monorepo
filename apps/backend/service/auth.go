package service

import (
	"errors"
	"log/slog"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/postgres"
	"github.com/nexus-commerce/backend/utils"
)

type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AdminLoginResponse struct {
	Token string                  `json:"token"`
	User  postgres.BackofficeUser `json:"user"`
}

func (s *Service) HandleAdminLogin(c *gin.Context) {
	var req AdminLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request payload", err)
		return
	}

	normalizedEmail := strings.TrimSpace(strings.ToLower(req.Email))

	user, err := s.store.GetBackofficeUserByEmail(c.Request.Context(), normalizedEmail)
	if err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			slog.Warn("Admin login attempt with non-existent email", "email", normalizedEmail)
			s.HandleResponseUnauthorized(c, "Invalid email or password")
			return
		}
		s.HandleResponseError(c, "Failed to authenticate", err)
		return
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		slog.Warn("Admin login failed password check", "email", normalizedEmail)
		s.HandleResponseUnauthorized(c, "Invalid email or password")
		return
	}

	token, err := utils.GenerateJWT(user.ID, user.Email, user.Role, s.cfg.JWT.Secret, s.cfg.JWT.ExpirationHours)
	if err != nil {
		s.HandleResponseError(c, "Failed to generate authentication token", err)
		return
	}

	s.HandleResponseAPIOK(c, AdminLoginResponse{
		Token: token,
		User:  *user,
	}, "Login successful")
}

type ChangeOwnPasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
}

func (s *Service) HandleChangeOwnPassword(c *gin.Context) {
	callerID := c.GetString("userID")
	if callerID == "" {
		s.HandleResponseUnauthorized(c, "Authentication required")
		return
	}

	var req ChangeOwnPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request payload", err)
		return
	}

	user, err := s.store.GetBackofficeUserByID(c.Request.Context(), callerID)
	if err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			s.HandleResponseUnauthorized(c, "User account not found")
			return
		}
		s.HandleResponseError(c, "Failed to retrieve user profile", err)
		return
	}

	if !utils.CheckPasswordHash(req.CurrentPassword, user.PasswordHash) {
		slog.Warn("Password change rejected: incorrect current password", "userID", callerID)
		c.JSON(400, Response{
			Message: "Current password is incorrect",
			Error:   true,
		})
		return
	}

	newHash, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		s.HandleResponseError(c, "Failed to hash new password", err)
		return
	}

	if err := s.store.UpdateBackofficeUserPassword(c.Request.Context(), callerID, newHash); err != nil {
		s.HandleResponseError(c, "Failed to update password", err)
		return
	}

	s.HandleResponseAPIOK(c, gin.H{"id": callerID}, "Password updated successfully")
}

type UpdateOwnProfileRequest struct {
	Name            string  `json:"name" binding:"required"`
	Email           string  `json:"email" binding:"required,email"`
	CurrentPassword *string `json:"current_password,omitempty"`
	NewPassword     *string `json:"new_password,omitempty"`
}

func (s *Service) HandleUpdateOwnProfile(c *gin.Context) {
	callerID := c.GetString("userID")
	if callerID == "" {
		s.HandleResponseUnauthorized(c, "Authentication required")
		return
	}

	var req UpdateOwnProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request payload", err)
		return
	}

	user, err := s.store.GetBackofficeUserByID(c.Request.Context(), callerID)
	if err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			s.HandleResponseUnauthorized(c, "User account not found")
			return
		}
		s.HandleResponseError(c, "Failed to retrieve user profile", err)
		return
	}

	// If password update requested, validate current password and new password
	if req.NewPassword != nil && strings.TrimSpace(*req.NewPassword) != "" {
		if req.CurrentPassword == nil || *req.CurrentPassword == "" {
			c.JSON(400, Response{
				Message: "Current password is required to set a new password",
				Error:   true,
			})
			return
		}
		if len(*req.NewPassword) < 6 {
			c.JSON(400, Response{
				Message: "New password must be at least 6 characters",
				Error:   true,
			})
			return
		}
		if !utils.CheckPasswordHash(*req.CurrentPassword, user.PasswordHash) {
			slog.Warn("Profile update rejected: incorrect current password", "userID", callerID)
			c.JSON(400, Response{
				Message: "Current password is incorrect",
				Error:   true,
			})
			return
		}

		newHash, err := utils.HashPassword(*req.NewPassword)
		if err != nil {
			s.HandleResponseError(c, "Failed to hash new password", err)
			return
		}

		if err := s.store.UpdateBackofficeUserPassword(c.Request.Context(), callerID, newHash); err != nil {
			s.HandleResponseError(c, "Failed to update password", err)
			return
		}
	}

	// Update name and email
	cleanName := strings.TrimSpace(req.Name)
	cleanEmail := strings.ToLower(strings.TrimSpace(req.Email))

	updatedUser, err := s.store.UpdateBackofficeUserProfile(c.Request.Context(), callerID, cleanName, cleanEmail)
	if err != nil {
		if errors.Is(err, postgres.ErrUserEmailAlreadyExists) {
			c.JSON(409, Response{
				Message: "An account with this email already exists",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to update user profile", err)
		return
	}

	// Generate refreshed JWT token with new email
	token, err := utils.GenerateJWT(updatedUser.ID, updatedUser.Email, updatedUser.Role, s.cfg.JWT.Secret, s.cfg.JWT.ExpirationHours)
	if err != nil {
		s.HandleResponseError(c, "Failed to refresh token", err)
		return
	}

	s.HandleResponseAPIOK(c, AdminLoginResponse{
		Token: token,
		User:  *updatedUser,
	}, "Profile updated successfully")
}
