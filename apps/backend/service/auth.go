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
