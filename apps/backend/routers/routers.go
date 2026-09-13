package routers

import (
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/service"
)

func Register(svc *service.Service, r *gin.Engine) {
	slog.Info("Registering application routes")

	// Health check endpoint
	r.GET("/health", svc.HandleHealthCheck)

	// Route groups for future releases
	api := r.Group("/api")
	{
		store := api.Group("/store")
		{
			// Storefront endpoints will be registered here in upcoming releases
			_ = store
		}

		admin := api.Group("/admin")
		{
			// Admin Backoffice endpoints will be registered here in upcoming releases
			_ = admin
		}
	}
}
