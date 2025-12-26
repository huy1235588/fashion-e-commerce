package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/huy1235588/fashion-e-commerce/internal/config"
	"github.com/huy1235588/fashion-e-commerce/internal/database"
	"github.com/huy1235588/fashion-e-commerce/internal/handlers"
	"github.com/huy1235588/fashion-e-commerce/internal/middleware"
	"github.com/huy1235588/fashion-e-commerce/internal/repositories"
	"github.com/huy1235588/fashion-e-commerce/internal/services"
	"github.com/huy1235588/fashion-e-commerce/internal/utils"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Set Gin mode
	gin.SetMode(cfg.Server.GinMode)

	// Connect to database
	if err := database.Connect(&cfg.Database); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run database migrations
	if err := database.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Get database instance
	db := database.GetDB()

	// Initialize JWT utility
	jwtUtil := utils.NewJWTUtil(cfg.App.JWTSecret, time.Duration(cfg.App.JWTExpiresHours)*time.Hour)

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	resetCodeRepo := repositories.NewPasswordResetCodeRepository(db)
	categoryRepo := repositories.NewCategoryRepository(db)
	productRepo := repositories.NewProductRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, resetCodeRepo, jwtUtil)
	categoryService := services.NewCategoryService(categoryRepo)
	productService := services.NewProductService(productRepo, categoryRepo)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtUtil)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	productHandler := handlers.NewProductHandler(productService)

	// Initialize Gin router
	router := gin.New()

	// Apply middleware in order: Recovery -> Logger -> CORS
	router.Use(middleware.Recovery())
	router.Use(middleware.Logger())
	router.Use(middleware.CORS())

	// Register routes
	api := router.Group("/api/v1")
	{
		// Public health check
		api.GET("/health", handlers.Health)

		// Auth routes (public)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/forgot-password", authHandler.SendResetCode)
			auth.POST("/reset-password", authHandler.ResetPassword)

			// Protected auth routes
			authProtected := auth.Group("")
			authProtected.Use(authMiddleware.ValidateJWT())
			{
				authProtected.GET("/profile", authHandler.GetProfile)
				authProtected.PUT("/profile", authHandler.UpdateProfile)
			}
		}

		// Category routes (public read, admin write)
		categories := api.Group("/categories")
		{
			categories.GET("", categoryHandler.ListCategories)
			categories.GET("/:id", categoryHandler.GetCategory)
			categories.GET("/slug/:slug", categoryHandler.GetCategoryBySlug)
		}

		// Product routes (public read, admin write)
		products := api.Group("/products")
		{
			products.GET("", productHandler.ListProducts)
			products.GET("/:id", productHandler.GetProduct)
			products.GET("/slug/:slug", productHandler.GetProductBySlug)
		}

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(authMiddleware.ValidateJWT(), authMiddleware.RequireAdmin())
		{
			// Category management
			adminCategories := admin.Group("/categories")
			{
				adminCategories.POST("", categoryHandler.CreateCategory)
				adminCategories.PUT("/:id", categoryHandler.UpdateCategory)
				adminCategories.DELETE("/:id", categoryHandler.DeleteCategory)
			}

			// Product management
			adminProducts := admin.Group("/products")
			{
				adminProducts.POST("", productHandler.CreateProduct)
				adminProducts.PUT("/:id", productHandler.UpdateProduct)
				adminProducts.DELETE("/:id", productHandler.DeleteProduct)
				
				// Product images
				adminProducts.POST("/:id/images", productHandler.AddProductImage)
				adminProducts.DELETE("/:id/images/:image_id", productHandler.DeleteProductImage)
				
				// Product variants
				adminProducts.POST("/:id/variants", productHandler.AddProductVariant)
				adminProducts.PUT("/:id/variants/:variant_id", productHandler.UpdateProductVariant)
				adminProducts.DELETE("/:id/variants/:variant_id", productHandler.DeleteProductVariant)
			}
		}
	}

	// Also register health check at root for convenience
	router.GET("/health", handlers.Health)

	// Create HTTP server
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	srv := &http.Server{
		Addr:    addr,
		Handler: router,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on port %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Server shutting down gracefully...")

	// Give outstanding requests 5 seconds to complete
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}
