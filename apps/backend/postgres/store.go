package postgres

import (
	"context"
	"database/sql"

	"github.com/nexus-commerce/backend/config"
)

type Storage interface {
	Ping(ctx context.Context) error
	CreateProduct(ctx context.Context, p *Product) (*Product, error)
	ListProducts(ctx context.Context) ([]Product, error)
}

type Store struct {
	db  *sql.DB
	cfg config.AppConfig
}

func NewStore(db *sql.DB, cfg config.AppConfig) *Store {
	return &Store{
		db:  db,
		cfg: cfg,
	}
}

func (s *Store) Ping(ctx context.Context) error {
	return s.db.PingContext(ctx)
}
