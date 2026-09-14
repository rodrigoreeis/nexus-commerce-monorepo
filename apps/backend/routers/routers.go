package routers

import (
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/service"
)

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func Register(svc *service.Service, r *gin.Engine) {
	slog.Info("Registering application routes")

	// Global CORS middleware
	r.Use(corsMiddleware())

	// Static file serving for uploads
	r.Static("/uploads", "./uploads")

	// Health check endpoint
	r.GET("/health", svc.HandleHealthCheck)

	// Route groups
	api := r.Group("/api")
	{
		store := api.Group("/store")
		{
			store.GET("/products", svc.HandleListProducts)
		}

		admin := api.Group("/admin")
		{
			admin.POST("/products", svc.HandleCreateProduct)
			admin.GET("/products", svc.HandleListProducts)
		}
	}
}
