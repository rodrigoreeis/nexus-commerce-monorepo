package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/lib/pq"
)

var (
	ErrUserNotFound           = errors.New("user not found")
	ErrUserEmailAlreadyExists = errors.New("user email already exists")
)

type BackofficeUser struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

func (s *Store) CreateBackofficeUser(ctx context.Context, u *BackofficeUser) (*BackofficeUser, error) {
	query := `
		INSERT INTO backoffice_users (name, email, password_hash, role)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`

	err := s.db.QueryRowContext(
		ctx,
		query,
		u.Name,
		u.Email,
		u.PasswordHash,
		u.Role,
	).Scan(&u.ID, &u.CreatedAt)

	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return nil, ErrUserEmailAlreadyExists
		}
		return nil, fmt.Errorf("failed to insert backoffice user: %w", err)
	}

	return u, nil
}

func (s *Store) GetBackofficeUserByEmail(ctx context.Context, email string) (*BackofficeUser, error) {
	query := `
		SELECT id, name, email, password_hash, role, created_at
		FROM backoffice_users
		WHERE email = $1
	`

	var u BackofficeUser
	err := s.db.QueryRowContext(ctx, query, email).Scan(
		&u.ID,
		&u.Name,
		&u.Email,
		&u.PasswordHash,
		&u.Role,
		&u.CreatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get backoffice user by email: %w", err)
	}

	return &u, nil
}

func (s *Store) GetBackofficeUserByID(ctx context.Context, id string) (*BackofficeUser, error) {
	query := `
		SELECT id, name, email, password_hash, role, created_at
		FROM backoffice_users
		WHERE id = $1
	`

	var u BackofficeUser
	err := s.db.QueryRowContext(ctx, query, id).Scan(
		&u.ID,
		&u.Name,
		&u.Email,
		&u.PasswordHash,
		&u.Role,
		&u.CreatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get backoffice user by id: %w", err)
	}

	return &u, nil
}

func (s *Store) ListBackofficeUsers(ctx context.Context) ([]BackofficeUser, error) {
	query := `
		SELECT id, name, email, role, created_at
		FROM backoffice_users
		ORDER BY created_at DESC
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query backoffice users: %w", err)
	}
	defer rows.Close()

	users := make([]BackofficeUser, 0)
	for rows.Next() {
		var u BackofficeUser
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Role, &u.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan backoffice user row: %w", err)
		}
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error during backoffice users query: %w", err)
	}

	return users, nil
}

func (s *Store) UpdateBackofficeUserRole(ctx context.Context, id string, newRole string) (*BackofficeUser, error) {
	query := `
		UPDATE backoffice_users
		SET role = $1
		WHERE id = $2
		RETURNING id, name, email, role, created_at
	`

	var u BackofficeUser
	err := s.db.QueryRowContext(ctx, query, newRole, id).Scan(
		&u.ID,
		&u.Name,
		&u.Email,
		&u.Role,
		&u.CreatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to update backoffice user role: %w", err)
	}

	return &u, nil
}

func (s *Store) DeleteBackofficeUser(ctx context.Context, id string) error {
	query := `
		DELETE FROM backoffice_users
		WHERE id = $1
	`

	res, err := s.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete backoffice user: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return ErrUserNotFound
	}

	return nil
}

func (s *Store) UpdateBackofficeUserPassword(ctx context.Context, id string, passwordHash string) error {
	query := `
		UPDATE backoffice_users
		SET password_hash = $1
		WHERE id = $2
	`

	res, err := s.db.ExecContext(ctx, query, passwordHash, id)
	if err != nil {
		return fmt.Errorf("failed to update backoffice user password: %w", err)
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return ErrUserNotFound
	}

	return nil
}

func (s *Store) UpdateBackofficeUserProfile(ctx context.Context, id string, name string, email string) (*BackofficeUser, error) {
	query := `
		UPDATE backoffice_users
		SET name = $1, email = $2
		WHERE id = $3
		RETURNING id, name, email, role, created_at
	`

	var u BackofficeUser
	err := s.db.QueryRowContext(ctx, query, name, email, id).Scan(
		&u.ID,
		&u.Name,
		&u.Email,
		&u.Role,
		&u.CreatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrUserNotFound
	}
	if err != nil {
		var pqErr *pq.Error
		if errors.As(err, &pqErr) && pqErr.Code == "23505" {
			return nil, ErrUserEmailAlreadyExists
		}
		return nil, fmt.Errorf("failed to update backoffice user profile: %w", err)
	}

	return &u, nil
}
