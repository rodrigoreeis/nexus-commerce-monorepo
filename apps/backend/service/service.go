package service

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/config"
	"github.com/nexus-commerce/backend/postgres"
)

type Response struct {
	Message string      `json:"message,omitempty"`
	Error   bool        `json:"error,omitempty"`
	Success bool        `json:"success,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type Service struct {
	store postgres.Storage
	cfg   config.AppConfig
}

func NewService(store postgres.Storage, cfg config.AppConfig) *Service {
	return &Service{
		store: store,
		cfg:   cfg,
	}
}

func (s *Service) HandleResponseAPIOK(c *gin.Context, data interface{}, message string) {
	slog.Info("HandleResponseAPIOK", "message", message)

	c.JSON(http.StatusOK, Response{
		Message: message,
		Data:    data,
		Success: true,
	})
}

func (s *Service) HandleResponseError(c *gin.Context, message string, err error) {
	slog.Error("HandleResponseError", "message", message, "error", err)

	if message == "" {
		c.JSON(http.StatusInternalServerError, Response{
			Message: "An internal server error occurred. Please try again later.",
			Error:   true,
		})
	} else {
		c.JSON(http.StatusBadRequest, Response{
			Message: message,
			Error:   true,
		})
	}
}

func (s *Service) HandleHealthCheck(c *gin.Context) {
	if err := s.store.Ping(c.Request.Context()); err != nil {
		slog.Error("Database health check failed", "error", err)
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":   "error",
			"database": "disconnected",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "ok",
		"database": "connected",
	})
}
