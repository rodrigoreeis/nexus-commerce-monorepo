package routers

import (
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/nexus-commerce/backend/service"
)

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Session-ID")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")

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
			store.GET("/products/:id", svc.HandleGetProduct)
			store.GET("/cart", svc.HandleGetCart)
			store.DELETE("/cart", svc.HandleClearCart)
			store.POST("/cart/items", svc.HandleAddCartItem)
			store.PATCH("/cart/items/:id", svc.HandleUpdateCartItem)
			store.DELETE("/cart/items/:id", svc.HandleRemoveCartItem)
		}

		admin := api.Group("/admin")
		{
			// Public admin auth routes
			admin.POST("/auth/login", svc.HandleAdminLogin)

			// Protected admin routes
			protected := admin.Group("")
			protected.Use(svc.RequireAuth())
			{
				// Products management
				protected.POST("/products", svc.HandleCreateProduct)
				protected.GET("/products", svc.HandleListProducts)
				protected.DELETE("/products/:id", svc.HandleDeleteProduct)
				protected.PUT("/products/:id", svc.HandleUpdateProduct)

				// Backoffice user management
				protected.GET("/users", service.RequireRoles("root", "admin", "manager"), svc.HandleListBackofficeUsers)
				protected.POST("/users", service.RequireRoles("root", "admin", "manager"), svc.HandleCreateBackofficeUser)
				protected.PATCH("/users/:id/role", service.RequireRoles("root", "admin"), svc.HandleUpdateBackofficeUserRole)
			}
		}
	}
}
