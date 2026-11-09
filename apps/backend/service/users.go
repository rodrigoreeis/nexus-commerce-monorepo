package service

import (
	"errors"
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/postgres"
	"github.com/nexus-commerce/backend/utils"
)

type CreateBackofficeUserRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required,oneof=admin manager user"`
}

type UpdateBackofficeUserRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=admin manager user"`
}

func (s *Service) HandleListBackofficeUsers(c *gin.Context) {
	callerRole := c.GetString("userRole")

	users, err := s.store.ListBackofficeUsers(c.Request.Context())
	if err != nil {
		s.HandleResponseError(c, "Failed to list backoffice users", err)
		return
	}

	// Root user is only visible to the root role itself
	if callerRole != "root" {
		filtered := make([]postgres.BackofficeUser, 0, len(users))
		for _, u := range users {
			if u.Role != "root" {
				filtered = append(filtered, u)
			}
		}
		users = filtered
	}

	s.HandleResponseAPIOK(c, users, "Backoffice users retrieved successfully")
}

func (s *Service) HandleCreateBackofficeUser(c *gin.Context) {
	callerRole := c.GetString("userRole")

	var req CreateBackofficeUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request payload", err)
		return
	}

	req.Role = strings.ToLower(strings.TrimSpace(req.Role))
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	// RBAC role creation enforcement
	if callerRole == "user" {
		s.HandleResponseForbidden(c, "Users are not allowed to create backoffice accounts")
		return
	}

	if callerRole == "manager" && req.Role != "user" {
		slog.Warn("Manager attempted to create non-user role", "requestedRole", req.Role)
		s.HandleResponseForbidden(c, "Managers are only permitted to create accounts with 'user' role")
		return
	}

	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		s.HandleResponseError(c, "Failed to hash password", err)
		return
	}

	newUser := &postgres.BackofficeUser{
		Name:         strings.TrimSpace(req.Name),
		Email:        req.Email,
		PasswordHash: hash,
		Role:         req.Role,
	}

	createdUser, err := s.store.CreateBackofficeUser(c.Request.Context(), newUser)
	if err != nil {
		if errors.Is(err, postgres.ErrUserEmailAlreadyExists) {
			c.JSON(http.StatusConflict, Response{
				Message: "An account with this email already exists",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to create backoffice user", err)
		return
	}

	s.HandleResponseCreated(c, createdUser, "Backoffice user created successfully")
}

func (s *Service) HandleUpdateBackofficeUserRole(c *gin.Context) {
	targetID := c.Param("id")
	if targetID == "" {
		s.HandleResponseError(c, "User ID is required", errors.New("missing user id"))
		return
	}

	targetUser, err := s.store.GetBackofficeUserByID(c.Request.Context(), targetID)
	if err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "User not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to verify target user", err)
		return
	}

	if targetUser.Role == "root" {
		s.HandleResponseForbidden(c, "The root user role is immutable and cannot be altered via API")
		return
	}

	callerID := c.GetString("userID")

	// Users cannot modify their own role regardless of their role
	if callerID == targetID {
		s.HandleResponseForbidden(c, "Users are not permitted to modify their own role")
		return
	}

	var req UpdateBackofficeUserRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request payload", err)
		return
	}

	req.Role = strings.ToLower(strings.TrimSpace(req.Role))

	updatedUser, err := s.store.UpdateBackofficeUserRole(c.Request.Context(), targetID, req.Role)
	if err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "User not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to update user role", err)
		return
	}

	s.HandleResponseAPIOK(c, updatedUser, "User role updated successfully")
}

type ResetBackofficeUserPasswordRequest struct {
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

func (s *Service) HandleDeleteBackofficeUser(c *gin.Context) {
	targetID := c.Param("id")
	if targetID == "" {
		s.HandleResponseError(c, "User ID is required", errors.New("missing user id"))
		return
	}

	callerID := c.GetString("userID")
	callerRole := c.GetString("userRole")

	// Users cannot delete their own account
	if callerID == targetID {
		s.HandleResponseForbidden(c, "Users are not permitted to delete their own account")
		return
	}

	targetUser, err := s.store.GetBackofficeUserByID(c.Request.Context(), targetID)
	if err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "User not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to verify target user", err)
		return
	}

	// RBAC Deletion rules:
	// - Root: can delete everything (except self, checked above)
	// - Admin: can delete admin, manager, user (cannot delete root)
	// - Manager: can only delete user
	// - User: cannot delete anyone
	if callerRole == "user" {
		s.HandleResponseForbidden(c, "Users are not permitted to delete accounts")
		return
	}

	if targetUser.Role == "root" && callerRole != "root" {
		slog.Warn("Non-root attempted to delete root user", "callerRole", callerRole, "targetID", targetID)
		s.HandleResponseForbidden(c, "The root user is protected and cannot be deleted by other roles")
		return
	}

	if callerRole == "manager" && targetUser.Role != "user" {
		slog.Warn("Manager attempted to delete non-operator user", "callerRole", callerRole, "targetRole", targetUser.Role)
		s.HandleResponseForbidden(c, "Managers are only permitted to delete operator (user) accounts")
		return
	}

	if err := s.store.DeleteBackofficeUser(c.Request.Context(), targetID); err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "User not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to delete backoffice user", err)
		return
	}

	s.HandleResponseAPIOK(c, gin.H{"id": targetID}, "Backoffice user deleted successfully")
}

func (s *Service) HandleResetBackofficeUserPassword(c *gin.Context) {
	targetID := c.Param("id")
	if targetID == "" {
		s.HandleResponseError(c, "User ID is required", errors.New("missing user id"))
		return
	}

	callerRole := c.GetString("userRole")

	var req ResetBackofficeUserPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request payload", err)
		return
	}

	targetUser, err := s.store.GetBackofficeUserByID(c.Request.Context(), targetID)
	if err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "User not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to verify target user", err)
		return
	}

	// RBAC Password Reset rules:
	// - Root: can reset password for anyone
	// - Admin: can reset password for admin, manager, user (cannot modify root)
	// - Manager: can only reset password for user
	// - User: cannot reset passwords of other accounts
	if callerRole == "user" {
		s.HandleResponseForbidden(c, "Users are not permitted to reset passwords of other accounts")
		return
	}

	if targetUser.Role == "root" && callerRole != "root" {
		s.HandleResponseForbidden(c, "The root user password cannot be reset by other roles")
		return
	}

	if callerRole == "manager" && targetUser.Role != "user" {
		s.HandleResponseForbidden(c, "Managers are only permitted to reset passwords for operator (user) accounts")
		return
	}

	hash, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		s.HandleResponseError(c, "Failed to hash password", err)
		return
	}

	if err := s.store.UpdateBackofficeUserPassword(c.Request.Context(), targetID, hash); err != nil {
		if errors.Is(err, postgres.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "User not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "Failed to reset user password", err)
		return
	}

	s.HandleResponseAPIOK(c, gin.H{"id": targetID}, "User password reset successfully")
}
