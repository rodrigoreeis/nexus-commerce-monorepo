package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

var (
	ErrCartNotFound     = errors.New("cart not found")
	ErrCartItemNotFound = errors.New("cart item not found")
)

type CartItem struct {
	ID        string    `json:"id"`
	CartID    string    `json:"cart_id"`
	ProductID string    `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Product   Product   `json:"product"`
	Subtotal  float64   `json:"subtotal"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Cart struct {
	ID        string     `json:"id"`
	SessionID string     `json:"session_id"`
	Items     []CartItem `json:"items"`
	Subtotal  float64    `json:"subtotal"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

func (s *Store) GetCartBySessionID(ctx context.Context, sessionID string) (*Cart, error) {
	cartQuery := `
		SELECT id, session_id, created_at, updated_at
		FROM carts
		WHERE session_id = $1
	`

	var cart Cart
	err := s.db.QueryRowContext(ctx, cartQuery, sessionID).Scan(
		&cart.ID,
		&cart.SessionID,
		&cart.CreatedAt,
		&cart.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return &Cart{
				SessionID: sessionID,
				Items:     []CartItem{},
				Subtotal:  0,
			}, nil
		}
		return nil, fmt.Errorf("failed to query cart by session id: %w", err)
	}

	itemsQuery := `
		SELECT 
			ci.id, ci.cart_id, ci.product_id, ci.quantity, ci.created_at, ci.updated_at,
			p.id, p.name, p.description, p.price, p.image_url, p.created_at, p.updated_at
		FROM cart_items ci
		INNER JOIN products p ON ci.product_id = p.id
		WHERE ci.cart_id = $1
		ORDER BY ci.created_at ASC
	`

	rows, err := s.db.QueryContext(ctx, itemsQuery, cart.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to query cart items: %w", err)
	}
	defer rows.Close()

	items := make([]CartItem, 0)
	var totalSubtotal float64

	for rows.Next() {
		var item CartItem
		if err := rows.Scan(
			&item.ID,
			&item.CartID,
			&item.ProductID,
			&item.Quantity,
			&item.CreatedAt,
			&item.UpdatedAt,
			&item.Product.ID,
			&item.Product.Name,
			&item.Product.Description,
			&item.Product.Price,
			&item.Product.ImageURL,
			&item.Product.CreatedAt,
			&item.Product.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan cart item: %w", err)
		}

		item.Subtotal = float64(item.Quantity) * item.Product.Price
		totalSubtotal += item.Subtotal
		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating cart item rows: %w", err)
	}

	cart.Items = items
	cart.Subtotal = totalSubtotal
	return &cart, nil
}

func (s *Store) GetOrCreateCartBySessionID(ctx context.Context, sessionID string) (*Cart, error) {
	insertQuery := `
		INSERT INTO carts (session_id)
		VALUES ($1)
		ON CONFLICT (session_id) DO NOTHING
	`
	if _, err := s.db.ExecContext(ctx, insertQuery, sessionID); err != nil {
		return nil, fmt.Errorf("failed to ensure cart exists: %w", err)
	}

	return s.GetCartBySessionID(ctx, sessionID)
}

func (s *Store) AddItemToCart(ctx context.Context, sessionID string, productID string, quantity int) (*Cart, error) {
	if _, err := s.GetProductByID(ctx, productID); err != nil {
		return nil, err
	}

	var cartID string
	upsertCartQuery := `
		INSERT INTO carts (session_id)
		VALUES ($1)
		ON CONFLICT (session_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
		RETURNING id
	`
	err := s.db.QueryRowContext(ctx, upsertCartQuery, sessionID).Scan(&cartID)
	if err != nil {
		return nil, fmt.Errorf("failed to upsert cart: %w", err)
	}

	upsertItemQuery := `
		INSERT INTO cart_items (cart_id, product_id, quantity)
		VALUES ($1, $2, $3)
		ON CONFLICT (cart_id, product_id)
		DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
	`
	if _, err := s.db.ExecContext(ctx, upsertItemQuery, cartID, productID, quantity); err != nil {
		return nil, fmt.Errorf("failed to upsert cart item: %w", err)
	}

	return s.GetCartBySessionID(ctx, sessionID)
}

func (s *Store) UpdateCartItemQuantity(ctx context.Context, sessionID string, itemID string, quantity int) (*Cart, error) {
	if quantity <= 0 {
		return s.RemoveCartItem(ctx, sessionID, itemID)
	}

	query := `
		UPDATE cart_items
		SET quantity = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2 AND cart_id = (SELECT id FROM carts WHERE session_id = $3)
	`
	res, err := s.db.ExecContext(ctx, query, quantity, itemID, sessionID)
	if err != nil {
		return nil, fmt.Errorf("failed to update cart item quantity: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("failed to check rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return nil, ErrCartItemNotFound
	}

	updateCartQuery := `
		UPDATE carts
		SET updated_at = CURRENT_TIMESTAMP
		WHERE session_id = $1
	`
	_, _ = s.db.ExecContext(ctx, updateCartQuery, sessionID)

	return s.GetCartBySessionID(ctx, sessionID)
}

func (s *Store) RemoveCartItem(ctx context.Context, sessionID string, itemID string) (*Cart, error) {
	query := `
		DELETE FROM cart_items
		WHERE id = $1 AND cart_id IN (SELECT id FROM carts WHERE session_id = $2)
	`
	if _, err := s.db.ExecContext(ctx, query, itemID, sessionID); err != nil {
		return nil, fmt.Errorf("failed to remove cart item: %w", err)
	}

	updateCartQuery := `
		UPDATE carts
		SET updated_at = CURRENT_TIMESTAMP
		WHERE session_id = $1
	`
	_, _ = s.db.ExecContext(ctx, updateCartQuery, sessionID)

	return s.GetCartBySessionID(ctx, sessionID)
}

func (s *Store) ClearCart(ctx context.Context, sessionID string) (*Cart, error) {
	query := `DELETE FROM carts WHERE session_id = $1`
	if _, err := s.db.ExecContext(ctx, query, sessionID); err != nil {
		return nil, fmt.Errorf("failed to clear cart: %w", err)
	}

	return &Cart{
		SessionID: sessionID,
		Items:     []CartItem{},
		Subtotal:  0,
	}, nil
}
