package service

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/utils"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestRequireAuthMiddleware(t *testing.T) {
	secret := "test-secret"
	token, err := utils.GenerateJWT("uid-1", "admin@nexus.com", "admin", secret, 1)
	if err != nil {
		t.Fatalf("failed to generate token: %v", err)
	}

	r := gin.New()
	r.Use(RequireAuth(secret))
	r.GET("/protected", func(c *gin.Context) {
		userID := c.GetString("userID")
		role := c.GetString("userRole")
		c.JSON(http.StatusOK, gin.H{"user_id": userID, "role": role})
	})

	// Case 1: Missing auth header
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for missing auth header, got %d", w.Code)
	}

	// Case 2: Invalid bearer format
	req = httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Token abc")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for invalid format, got %d", w.Code)
	}

	// Case 3: Valid bearer token
	req = httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200 for valid token, got %d", w.Code)
	}
}

func TestRequireRolesMiddleware(t *testing.T) {
	r := gin.New()
	r.GET("/admin-only", func(c *gin.Context) {
		c.Set("userRole", c.GetHeader("X-Role"))
		c.Next()
	}, RequireRoles("admin"), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	// Case 1: Admin role allowed
	req := httptest.NewRequest(http.MethodGet, "/admin-only", nil)
	req.Header.Set("X-Role", "admin")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200 for admin, got %d", w.Code)
	}

	// Case 2: User role forbidden
	req = httptest.NewRequest(http.MethodGet, "/admin-only", nil)
	req.Header.Set("X-Role", "user")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusForbidden {
		t.Errorf("expected 403 for user, got %d", w.Code)
	}
}

func TestRequireRolesMiddlewareWithRoot(t *testing.T) {
	r := gin.New()
	r.GET("/root-or-admin", func(c *gin.Context) {
		c.Set("userRole", c.GetHeader("X-Role"))
		c.Next()
	}, RequireRoles("root", "admin"), func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	// Case 1: Root role allowed
	req := httptest.NewRequest(http.MethodGet, "/root-or-admin", nil)
	req.Header.Set("X-Role", "root")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200 for root, got %d", w.Code)
	}

	// Case 2: Admin role allowed
	req = httptest.NewRequest(http.MethodGet, "/root-or-admin", nil)
	req.Header.Set("X-Role", "admin")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200 for admin, got %d", w.Code)
	}

	// Case 3: User role forbidden
	req = httptest.NewRequest(http.MethodGet, "/root-or-admin", nil)
	req.Header.Set("X-Role", "user")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusForbidden {
		t.Errorf("expected 403 for user, got %d", w.Code)
	}
}
