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
	GetProductByID(ctx context.Context, id string) (*Product, error)
	DeleteProduct(ctx context.Context, id string) (*Product, error)
	UpdateProduct(ctx context.Context, p *Product) (*Product, error)

	GetOrCreateCartBySessionID(ctx context.Context, sessionID string) (*Cart, error)
	GetCartBySessionID(ctx context.Context, sessionID string) (*Cart, error)
	AddItemToCart(ctx context.Context, sessionID string, productID string, quantity int) (*Cart, error)
	UpdateCartItemQuantity(ctx context.Context, sessionID string, itemID string, quantity int) (*Cart, error)
	RemoveCartItem(ctx context.Context, sessionID string, itemID string) (*Cart, error)
	ClearCart(ctx context.Context, sessionID string) (*Cart, error)

	CreateBackofficeUser(ctx context.Context, u *BackofficeUser) (*BackofficeUser, error)
	GetBackofficeUserByEmail(ctx context.Context, email string) (*BackofficeUser, error)
	GetBackofficeUserByID(ctx context.Context, id string) (*BackofficeUser, error)
	ListBackofficeUsers(ctx context.Context) ([]BackofficeUser, error)
	UpdateBackofficeUserRole(ctx context.Context, id string, newRole string) (*BackofficeUser, error)
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
