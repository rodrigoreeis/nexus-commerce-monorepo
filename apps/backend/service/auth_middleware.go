package service

import (
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/utils"
)

func RequireAuth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			slog.Warn("Authorization header missing", "path", c.Request.URL.Path)
			c.AbortWithStatusJSON(http.StatusUnauthorized, Response{
				Message: "Authorization header is required",
				Error:   true,
			})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			slog.Warn("Invalid authorization format", "header", authHeader)
			c.AbortWithStatusJSON(http.StatusUnauthorized, Response{
				Message: "Invalid authorization format, must be 'Bearer <token>'",
				Error:   true,
			})
			return
		}

		tokenString := strings.TrimSpace(parts[1])
		claims, err := utils.ValidateJWT(tokenString, jwtSecret)
		if err != nil {
			slog.Warn("Failed to validate JWT token", "error", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, Response{
				Message: "Invalid or expired token",
				Error:   true,
			})
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRole", claims.Role)

		c.Next()
	}
}

func RequireRoles(allowedRoles ...string) gin.HandlerFunc {
	roleMap := make(map[string]bool, len(allowedRoles))
	for _, r := range allowedRoles {
		roleMap[r] = true
	}

	return func(c *gin.Context) {
		roleVal, exists := c.Get("userRole")
		if !exists {
			slog.Warn("userRole not found in context")
			c.AbortWithStatusJSON(http.StatusUnauthorized, Response{
				Message: "Unauthorized: authentication required",
				Error:   true,
			})
			return
		}

		userRole, _ := roleVal.(string)
		if !roleMap[userRole] {
			slog.Warn("Forbidden role access", "userRole", userRole, "allowedRoles", allowedRoles)
			c.AbortWithStatusJSON(http.StatusForbidden, Response{
				Message: "Forbidden: insufficient permissions",
				Error:   true,
			})
			return
		}

		c.Next()
	}
}
