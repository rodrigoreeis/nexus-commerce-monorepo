package routers

import (
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/service"
)

func Register(svc *service.Service, r *gin.Engine) {
	slog.Info("Registering application routes")

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
