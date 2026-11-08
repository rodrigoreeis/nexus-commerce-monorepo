package utils

import (
	"testing"
)

func TestHashPasswordAndCheck(t *testing.T) {
	password := "securePassword123"
	hash, err := HashPassword(password)
	if err != nil {
		t.Fatalf("unexpected error hashing password: %v", err)
	}

	if !CheckPasswordHash(password, hash) {
		t.Errorf("expected password to match hash")
	}

	if CheckPasswordHash("wrongPassword", hash) {
		t.Errorf("expected wrong password to not match hash")
	}
}

func TestGenerateAndValidateJWT(t *testing.T) {
	secret := "test-secret-key-123"
	userID := "user-123"
	email := "admin@nexuscommerce.com"
	role := "admin"

	token, err := GenerateJWT(userID, email, role, secret, 1)
	if err != nil {
		t.Fatalf("unexpected error generating JWT: %v", err)
	}

	claims, err := ValidateJWT(token, secret)
	if err != nil {
		t.Fatalf("unexpected error validating JWT: %v", err)
	}

	if claims.UserID != userID {
		t.Errorf("expected userID %s, got %s", userID, claims.UserID)
	}
	if claims.Email != email {
		t.Errorf("expected email %s, got %s", email, claims.Email)
	}
	if claims.Role != role {
		t.Errorf("expected role %s, got %s", role, claims.Role)
	}

	// Validate with wrong secret
	_, err = ValidateJWT(token, "wrong-secret")
	if err == nil {
		t.Errorf("expected error when validating with wrong secret")
	}
}
