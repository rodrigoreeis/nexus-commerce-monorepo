package postgres

import (
	"database/sql"
	"fmt"
	"log/slog"

	_ "github.com/lib/pq"
	"github.com/nexus-commerce/backend/config"
)

func NewDBConnection(cfg config.AppConfig) *sql.DB {
	sslMode := cfg.Database.SSLMode
	if sslMode == "" {
		sslMode = "disable"
	}

	connectionString := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.DBName,
		sslMode,
	)

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		slog.Error("failed to open database connection", "error", err)
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		slog.Error("failed to ping database", "error", err)
		panic(err)
	}

	slog.Info("PostgreSQL connection established successfully")
	return db
}
