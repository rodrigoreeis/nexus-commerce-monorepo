package config

import (
	"fmt"
	"os"

	"github.com/pelletier/go-toml/v2"
)

type ServerConfig struct {
	Port string `toml:"port"`
}

type DatabaseConfig struct {
	Host     string `toml:"host"`
	Port     string `toml:"port"`
	User     string `toml:"user"`
	Password string `toml:"password"`
	DBName   string `toml:"dbname"`
	SSLMode  string `toml:"sslmode"`
}

type AppConfig struct {
	Server   ServerConfig   `toml:"server"`
	Database DatabaseConfig `toml:"database"`
}

func LoadConfigEnv() (AppConfig, error) {
	var cfg AppConfig

	configPaths := []string{
		"config.toml",
		"apps/backend/config.toml",
		"backend/config.toml",
		"../config.toml",
	}

	var data []byte
	var err error
	found := false

	for _, path := range configPaths {
		data, err = os.ReadFile(path)
		if err == nil {
			found = true
			break
		}
	}

	if !found {
		return cfg, fmt.Errorf("unable to find config.toml in search paths: %w", err)
	}

	if err := toml.Unmarshal(data, &cfg); err != nil {
		return cfg, fmt.Errorf("failed to unmarshal config.toml: %w", err)
	}

	// Environment variable overrides if present
	if port := os.Getenv("SERVER_PORT"); port != "" {
		cfg.Server.Port = port
	}
	if host := os.Getenv("DB_HOST"); host != "" {
		cfg.Database.Host = host
	}
	if port := os.Getenv("DB_PORT"); port != "" {
		cfg.Database.Port = port
	}
	if user := os.Getenv("DB_USER"); user != "" {
		cfg.Database.User = user
	}
	if pass := os.Getenv("DB_PASSWORD"); pass != "" {
		cfg.Database.Password = pass
	}
	if dbname := os.Getenv("DB_NAME"); dbname != "" {
		cfg.Database.DBName = dbname
	}

	return cfg, nil
}
