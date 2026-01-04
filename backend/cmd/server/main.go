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

	// Initialize shared utilities
	emailService := utils.NewEmailService(
		cfg.Email.Host,
		cfg.Email.Port,
		cfg.Email.Username,
		cfg.Email.Password,
		cfg.Email.FromName,
		"./internal/utils/templates",
	)
	uploadService := utils.NewUploadService(cfg.Upload.MaxFileSize, cfg.Upload.UploadDir)

	// Initialize payment helpers
	vnpayHelper := utils.NewVNPayHelper(utils.VNPayConfig{
		TmnCode:    cfg.Payment.VNPay.TmnCode,
		HashSecret: cfg.Payment.VNPay.HashSecret,
		PaymentURL: cfg.Payment.VNPay.PaymentURL,
		ReturnURL:  cfg.Payment.VNPay.ReturnURL,
	})

	momoHelper := utils.NewMoMoHelper(utils.MoMoConfig{
		PartnerCode: cfg.Payment.MoMo.PartnerCode,
		AccessKey:   cfg.Payment.MoMo.AccessKey,
		SecretKey:   cfg.Payment.MoMo.SecretKey,
		PaymentURL:  cfg.Payment.MoMo.PaymentURL,
		IPNUrl:      cfg.Payment.MoMo.IPNUrl,
		ReturnURL:   cfg.Payment.MoMo.ReturnURL,
	})

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	resetCodeRepo := repositories.NewPasswordResetCodeRepository(db)
	categoryRepo := repositories.NewCategoryRepository(db)
	productRepo := repositories.NewProductRepository(db)
	cartRepo := repositories.NewCartRepository(db)
	addressRepo := repositories.NewAddressRepository(db)
	orderRepo := repositories.NewOrderRepository(db)
	paymentRepo := repositories.NewPaymentRepository(db)
	reviewRepo := repositories.NewReviewRepository(db)
	statsRepo := repositories.NewStatisticsRepository(db)

	// Initialize services
	authService := services.NewAuthService(userRepo, resetCodeRepo, jwtUtil, emailService)
	categoryService := services.NewCategoryService(categoryRepo)
	productService := services.NewProductService(productRepo, categoryRepo, uploadService)
	cartService := services.NewCartService(cartRepo, productRepo)
	addressService := services.NewAddressService(addressRepo)
	orderService := services.NewOrderService(orderRepo, cartRepo, addressRepo, productRepo, db, emailService)
	paymentService := services.NewPaymentService(paymentRepo, orderRepo, vnpayHelper, momoHelper, db)
	reviewService := services.NewReviewService(reviewRepo, orderRepo)
	adminService := services.NewAdminService(db, userRepo, productRepo, orderRepo)
	statisticsService := services.NewStatisticsService(statsRepo)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtUtil)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	categoryHandler := handlers.NewCategoryHandler(categoryService)
	productHandler := handlers.NewProductHandler(productService)
	cartHandler := handlers.NewCartHandler(cartService)
	addressHandler := handlers.NewAddressHandler(addressService)
	orderHandler := handlers.NewOrderHandler(orderService)
	paymentHandler := handlers.NewPaymentHandler(paymentService)
	reviewHandler := handlers.NewReviewHandler(reviewService)
	adminHandler := handlers.NewAdminHandler(adminService)
	statisticsHandler := handlers.NewStatisticsHandler(statisticsService)

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
			// Review routes for products (public read)
			products.GET("/:id/reviews", reviewHandler.GetProductReviews)
			products.GET("/:id/rating", reviewHandler.GetProductRating)
		}

		// Cart routes (protected)
		cart := api.Group("/cart")
		cart.Use(authMiddleware.ValidateJWT())
		{
			cart.GET("", cartHandler.GetCart)
			cart.POST("/items", cartHandler.AddToCart)
			cart.PUT("/items/:id", cartHandler.UpdateCartItem)
			cart.DELETE("/items/:id", cartHandler.RemoveCartItem)
			cart.POST("/clear", cartHandler.ClearCart)
		}

		// Address routes (protected)
		addresses := api.Group("/addresses")
		addresses.Use(authMiddleware.ValidateJWT())
		{
			addresses.GET("", addressHandler.ListAddresses)
			addresses.GET("/:id", addressHandler.GetAddress)
			addresses.POST("", addressHandler.CreateAddress)
			addresses.PUT("/:id", addressHandler.UpdateAddress)
			addresses.DELETE("/:id", addressHandler.DeleteAddress)
			addresses.PUT("/:id/set-default", addressHandler.SetDefaultAddress)
		}

		// Order routes (protected)
		orders := api.Group("/orders")
		orders.Use(authMiddleware.ValidateJWT())
		{
			orders.POST("", orderHandler.CreateOrder)
			orders.GET("", orderHandler.GetMyOrders)
			orders.GET("/:id", orderHandler.GetOrderByID)
			orders.POST("/:id/cancel", orderHandler.CancelOrder)
		}

		// Payment routes
		payments := api.Group("/payments")
		{
			// Protected: initiate payment
			payments.POST("/initiate", authMiddleware.ValidateJWT(), paymentHandler.InitiatePayment)

			// Public: payment callbacks
			payments.GET("/vnpay/callback", paymentHandler.VNPayCallback)
			payments.GET("/vnpay/return", paymentHandler.VNPayReturn)
			payments.POST("/momo/ipn", paymentHandler.MoMoCallback)
			payments.GET("/momo/return", paymentHandler.MoMoReturn)
		}

		// Review routes (protected)
		reviews := api.Group("/reviews")
		reviews.Use(authMiddleware.ValidateJWT())
		{
			reviews.POST("", reviewHandler.CreateReview)
			reviews.DELETE("/:id", reviewHandler.DeleteReview)
		}

		// User routes (protected)
		users := api.Group("/users")
		users.Use(authMiddleware.ValidateJWT())
		{
			users.GET("/me/reviews", reviewHandler.GetUserReviews)
		}

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(authMiddleware.ValidateJWT(), authMiddleware.RequireAdmin())
		{
			// Dashboard
			admin.GET("/dashboard/stats", adminHandler.GetDashboardStats)

			// Statistics routes
			statistics := admin.Group("/statistics")
			{
				statistics.GET("/dashboard", statisticsHandler.GetDashboardStats)
				statistics.GET("/revenue", statisticsHandler.GetRevenue)
				statistics.GET("/products/top", statisticsHandler.GetTopProducts)
				statistics.GET("/orders", statisticsHandler.GetOrderStats)
				statistics.GET("/customers", statisticsHandler.GetCustomerStats)
				statistics.GET("/categories/revenue", statisticsHandler.GetCategoryRevenue)
			}

			// User management
			admin.GET("/users", adminHandler.ListAllUsers)
			admin.PUT("/users/:id/role", adminHandler.UpdateUserRole)

			// Order management
			admin.GET("/orders", adminHandler.ListAllOrders)
			admin.PUT("/orders/:id/status", adminHandler.UpdateOrderStatus)

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
