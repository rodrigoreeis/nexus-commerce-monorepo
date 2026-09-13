package cmd

import (
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/config"
	"github.com/nexus-commerce/backend/postgres"
	"github.com/nexus-commerce/backend/routers"
	"github.com/nexus-commerce/backend/service"
)

type APIServer struct {
	cfg config.AppConfig
	db  *sql.DB
}

func NewAPIServer(cfg config.AppConfig, db *sql.DB) *APIServer {
	return &APIServer{
		cfg: cfg,
		db:  db,
	}
}

func (s *APIServer) Run() error {
	r := gin.Default()

	store := postgres.NewStore(s.db, s.cfg)
	svc := service.NewService(store, s.cfg)

	routers.Register(svc, r)

	port := s.cfg.Server.Port
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	slog.Info("Starting HTTP server", "address", addr)
	return r.Run(addr)
}
