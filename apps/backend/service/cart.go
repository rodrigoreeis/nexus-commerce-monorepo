package service

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/nexus-commerce/backend/postgres"
)

type AddCartItemRequest struct {
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}

type UpdateCartItemRequest struct {
	Quantity int `json:"quantity"`
}

func (s *Service) getSessionID(c *gin.Context) (string, bool) {
	sessionID := strings.TrimSpace(c.GetHeader("X-Session-ID"))
	if sessionID == "" {
		sessionID = strings.TrimSpace(c.Query("session_id"))
	}

	if sessionID == "" {
		c.JSON(http.StatusBadRequest, Response{
			Message: "Session ID is required via X-Session-ID header or session_id query parameter",
			Error:   true,
		})
		return "", false
	}

	return sessionID, true
}

func (s *Service) HandleGetCart(c *gin.Context) {
	sessionID, ok := s.getSessionID(c)
	if !ok {
		return
	}

	cart, err := s.store.GetCartBySessionID(c.Request.Context(), sessionID)
	if err != nil {
		s.HandleResponseError(c, "", err)
		return
	}

	s.HandleResponseAPIOK(c, cart, "Cart retrieved successfully")
}

func (s *Service) HandleAddCartItem(c *gin.Context) {
	sessionID, ok := s.getSessionID(c)
	if !ok {
		return
	}

	var req AddCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request body format", err)
		return
	}

	productID := strings.TrimSpace(req.ProductID)
	if _, err := uuid.Parse(productID); err != nil {
		s.HandleResponseError(c, "Invalid product ID format", err)
		return
	}

	quantity := req.Quantity
	if quantity <= 0 {
		quantity = 1
	}

	cart, err := s.store.AddItemToCart(c.Request.Context(), sessionID, productID, quantity)
	if err != nil {
		if errors.Is(err, postgres.ErrProductNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "Product not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "", err)
		return
	}

	s.HandleResponseAPIOK(c, cart, "Item added to cart successfully")
}

func (s *Service) HandleUpdateCartItem(c *gin.Context) {
	sessionID, ok := s.getSessionID(c)
	if !ok {
		return
	}

	itemID := strings.TrimSpace(c.Param("id"))
	if _, err := uuid.Parse(itemID); err != nil {
		s.HandleResponseError(c, "Invalid cart item ID format", err)
		return
	}

	var req UpdateCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		s.HandleResponseError(c, "Invalid request body format", err)
		return
	}

	if req.Quantity < 0 {
		s.HandleResponseError(c, "Quantity must be greater than or equal to 0", nil)
		return
	}

	cart, err := s.store.UpdateCartItemQuantity(c.Request.Context(), sessionID, itemID, req.Quantity)
	if err != nil {
		if errors.Is(err, postgres.ErrCartItemNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "Cart item not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "", err)
		return
	}

	s.HandleResponseAPIOK(c, cart, "Cart item updated successfully")
}

func (s *Service) HandleRemoveCartItem(c *gin.Context) {
	sessionID, ok := s.getSessionID(c)
	if !ok {
		return
	}

	itemID := strings.TrimSpace(c.Param("id"))
	if _, err := uuid.Parse(itemID); err != nil {
		s.HandleResponseError(c, "Invalid cart item ID format", err)
		return
	}

	cart, err := s.store.RemoveCartItem(c.Request.Context(), sessionID, itemID)
	if err != nil {
		if errors.Is(err, postgres.ErrCartItemNotFound) {
			c.JSON(http.StatusNotFound, Response{
				Message: "Cart item not found",
				Error:   true,
			})
			return
		}
		s.HandleResponseError(c, "", err)
		return
	}

	s.HandleResponseAPIOK(c, cart, "Cart item removed successfully")
}

func (s *Service) HandleClearCart(c *gin.Context) {
	sessionID, ok := s.getSessionID(c)
	if !ok {
		return
	}

	cart, err := s.store.ClearCart(c.Request.Context(), sessionID)
	if err != nil {
		s.HandleResponseError(c, "", err)
		return
	}

	s.HandleResponseAPIOK(c, cart, "Cart cleared successfully")
}

