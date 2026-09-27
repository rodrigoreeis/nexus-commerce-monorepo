package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

var ErrProductNotFound = errors.New("product not found")

type Product struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	ImageURL    string    `json:"image_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (s *Store) CreateProduct(ctx context.Context, p *Product) (*Product, error) {
	query := `
		INSERT INTO products (name, description, price, image_url)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`

	err := s.db.QueryRowContext(
		ctx,
		query,
		p.Name,
		p.Description,
		p.Price,
		p.ImageURL,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert product: %w", err)
	}

	return p, nil
}

func (s *Store) ListProducts(ctx context.Context) ([]Product, error) {
	query := `
		SELECT id, name, description, price, image_url, created_at, updated_at
		FROM products
		ORDER BY created_at DESC
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query products: %w", err)
	}
	defer rows.Close()

	products := make([]Product, 0)
	for rows.Next() {
		var p Product
		if err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Description,
			&p.Price,
			&p.ImageURL,
			&p.CreatedAt,
			&p.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan product row: %w", err)
		}
		products = append(products, p)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating product rows: %w", err)
	}

	return products, nil
}

func (s *Store) DeleteProduct(ctx context.Context, id string) (*Product, error) {
	query := `
		DELETE FROM products
		WHERE id = $1
		RETURNING id, name, image_url
	`
	var p Product
	err := s.db.QueryRowContext(ctx, query, id).Scan(&p.ID, &p.Name, &p.ImageURL)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrProductNotFound
		}
		return nil, fmt.Errorf("failed to delete product: %w", err)
	}
	return &p, nil
}

func (s *Store) UpdateProduct(ctx context.Context, p *Product) (*Product, error) {
	var query string
	var row *sql.Row

	if p.ImageURL != "" {
		query = `
			UPDATE products
			SET name = $1, description = $2, price = $3, image_url = $4, updated_at = CURRENT_TIMESTAMP
			WHERE id = $5
			RETURNING id, name, description, price, image_url, created_at, updated_at
		`
		row = s.db.QueryRowContext(ctx, query, p.Name, p.Description, p.Price, p.ImageURL, p.ID)
	} else {
		query = `
			UPDATE products
			SET name = $1, description = $2, price = $3, updated_at = CURRENT_TIMESTAMP
			WHERE id = $4
			RETURNING id, name, description, price, image_url, created_at, updated_at
		`
		row = s.db.QueryRowContext(ctx, query, p.Name, p.Description, p.Price, p.ID)
	}

	var updated Product
	err := row.Scan(
		&updated.ID,
		&updated.Name,
		&updated.Description,
		&updated.Price,
		&updated.ImageURL,
		&updated.CreatedAt,
		&updated.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrProductNotFound
		}
		return nil, fmt.Errorf("failed to update product: %w", err)
	}

	return &updated, nil
}


