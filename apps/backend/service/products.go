package service

import (
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/nexus-commerce/backend/postgres"
)

const (
	maxFileSize = 5 * 1024 * 1024 // 5MB
	uploadsDir  = "./uploads"
)

var allowedMIMETypes = map[string]string{
	"image/jpeg": ".jpg",
	"image/png":  ".png",
	"image/webp": ".webp",
}

var allowedExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".webp": true,
}

func validateImageFile(fileHeader *multipart.FileHeader) (string, error) {
	if fileHeader.Size > maxFileSize {
		return "", errors.New("image file size exceeds maximum allowed size of 5MB")
	}

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	contentType := fileHeader.Header.Get("Content-Type")

	// Verify either the MIME type or the file extension is allowed
	_, mimeOk := allowedMIMETypes[contentType]
	extOk := allowedExtensions[ext]

	if !mimeOk && !extOk {
		return "", errors.New("invalid image format: only JPEG, PNG, and WebP are allowed")
	}

	if ext == "" {
		ext = allowedMIMETypes[contentType]
	}

	return ext, nil
}

func saveUploadedImage(c *gin.Context, fileHeader *multipart.FileHeader) (string, error) {
	ext, err := validateImageFile(fileHeader)
	if err != nil {
		return "", err
	}

	if err := os.MkdirAll(uploadsDir, 0755); err != nil {
		return "", fmt.Errorf("failed to ensure uploads directory exists: %w", err)
	}

	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	dst := filepath.Join(uploadsDir, filename)

	if err := c.SaveUploadedFile(fileHeader, dst); err != nil {
		return "", fmt.Errorf("failed to save uploaded file: %w", err)
	}

	return fmt.Sprintf("/uploads/%s", filename), nil
}

func (s *Service) HandleCreateProduct(c *gin.Context) {
	name := strings.TrimSpace(c.PostForm("name"))
	if name == "" {
		s.HandleResponseError(c, "Product name is required", nil)
		return
	}

	priceStr := strings.TrimSpace(c.PostForm("price"))
	if priceStr == "" {
		s.HandleResponseError(c, "Product price is required", nil)
		return
	}

	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil || price < 0 {
		s.HandleResponseError(c, "Product price must be a valid positive number", nil)
		return
	}

	description := strings.TrimSpace(c.PostForm("description"))
	if len([]rune(description)) > 500 {
		s.HandleResponseError(c, "Product description cannot exceed 500 characters", nil)
		return
	}

	fileHeader, err := c.FormFile("image")
	if err != nil {
		s.HandleResponseError(c, "Product image is required", err)
		return
	}

	imageURL, err := saveUploadedImage(c, fileHeader)
	if err != nil {
		if errors.Is(err, os.ErrPermission) {
			s.HandleResponseError(c, "", err)
		} else {
			s.HandleResponseError(c, err.Error(), err)
		}
		return
	}

	product := &postgres.Product{
		Name:        name,
		Description: description,
		Price:       price,
		ImageURL:    imageURL,
	}

	created, err := s.store.CreateProduct(c.Request.Context(), product)
	if err != nil {
		s.HandleResponseError(c, "", err)
		return
	}

	s.HandleResponseCreated(c, created, "Product created successfully")
}

func (s *Service) HandleListProducts(c *gin.Context) {
	products, err := s.store.ListProducts(c.Request.Context())
	if err != nil {
		s.HandleResponseError(c, "", err)
		return
	}

	s.HandleResponseAPIOK(c, products, "Products retrieved successfully")
}
