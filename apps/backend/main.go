package main

import (
	"log/slog"
	"os"

	"github.com/nexus-commerce/backend/cmd"
	"github.com/nexus-commerce/backend/config"
	"github.com/nexus-commerce/backend/postgres"
)

func main() {
	slog.Info("Starting Nexus Commerce API backend...")

	cfg, err := config.LoadConfigEnv()
	if err != nil {
		slog.Error("Failed to load configuration", "error", err)
		os.Exit(1)
	}

	db := postgres.NewDBConnection(cfg)
	defer db.Close()

	server := cmd.NewAPIServer(cfg, db)
	if err := server.Run(); err != nil {
		slog.Error("Server terminated with error", "error", err)
		os.Exit(1)
	}
}
