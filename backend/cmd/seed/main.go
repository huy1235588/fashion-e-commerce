package main

import (
	"fmt"
	"log"

	"github.com/huy1235588/fashion-e-commerce/internal/config"
	"github.com/huy1235588/fashion-e-commerce/internal/database"
	"github.com/huy1235588/fashion-e-commerce/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Connect to database
	if err := database.Connect(&cfg.Database); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	db := database.DB

	log.Println("Dropping existing tables...")
	// Drop all tables in order (respecting foreign keys)
	if err := db.Migrator().DropTable(
		&models.Review{},
		&models.Payment{},
		&models.OrderItem{},
		&models.Order{},
		&models.Address{},
		&models.CartItem{},
		&models.Cart{},
		&models.ProductVariant{},
		&models.ProductImage{},
		&models.Product{},
		&models.Category{},
		&models.PasswordResetCode{},
		&models.User{},
	); err != nil {
		log.Fatalf("Failed to drop tables: %v", err)
	}
	log.Println("✅ All tables dropped")

	log.Println("Running migrations...")
	if err := database.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Starting to seed data...")

	// Seed in order
	if err := seedUsers(db); err != nil {
		log.Fatalf("Failed to seed users: %v", err)
	}

	if err := seedCategories(db); err != nil {
		log.Fatalf("Failed to seed categories: %v", err)
	}

	if err := seedProducts(db); err != nil {
		log.Fatalf("Failed to seed products: %v", err)
	}

	if err := seedAddresses(db); err != nil {
		log.Fatalf("Failed to seed addresses: %v", err)
	}

	log.Println("✅ Data seeding completed successfully!")
}

func seedUsers(db *gorm.DB) error {
	log.Println("Seeding users...")

	// Check if users already exist
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		log.Println("Users already exist, skipping...")
		return nil
	}

	// Hash password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)

	users := []models.User{
		{
			Email:    "admin@example.com",
			Password: string(hashedPassword),
			FullName: "Admin User",
			Phone:    "0901234567",
			Role:     "admin",
			IsActive: true,
		},
		{
			Email:    "user1@example.com",
			Password: string(hashedPassword),
			FullName: "Nguyễn Văn A",
			Phone:    "0912345678",
			Role:     "user",
			IsActive: true,
		},
		{
			Email:    "user2@example.com",
			Password: string(hashedPassword),
			FullName: "Trần Thị B",
			Phone:    "0923456789",
			Role:     "user",
			IsActive: true,
		},
	}

	return db.Create(&users).Error
}

func seedCategories(db *gorm.DB) error {
	log.Println("Seeding categories...")

	var count int64
	db.Model(&models.Category{}).Count(&count)
	if count > 0 {
		log.Println("Categories already exist, skipping...")
		return nil
	}

	categories := []models.Category{
		{
			Name:        "Áo nam",
			Slug:        "ao-nam",
			Description: "Các loại áo dành cho nam giới",
		},
		{
			Name:        "Quần nam",
			Slug:        "quan-nam",
			Description: "Các loại quần dành cho nam giới",
		},
		{
			Name:        "Áo nữ",
			Slug:        "ao-nu",
			Description: "Các loại áo dành cho nữ giới",
		},
		{
			Name:        "Quần nữ",
			Slug:        "quan-nu",
			Description: "Các loại quần dành cho nữ giới",
		},
		{
			Name:        "Phụ kiện",
			Slug:        "phu-kien",
			Description: "Các loại phụ kiện thời trang",
		},
	}

	return db.Create(&categories).Error
}

func seedProducts(db *gorm.DB) error {
	log.Println("Seeding products...")

	var count int64
	db.Model(&models.Product{}).Count(&count)
	if count > 0 {
		log.Println("Products already exist, skipping...")
		return nil
	}

	// Get categories
	var categories []models.Category
	if err := db.Find(&categories).Error; err != nil {
		return err
	}
	if len(categories) < 5 {
		return fmt.Errorf("expected at least 5 categories, got %d", len(categories))
	}

	products := []models.Product{
		// Áo nam
		{
			CategoryID:    categories[0].ID,
			Name:          "Áo thun nam tay ngắn cotton form fitted cổ tròn",
			Description:   "Mẫu áo thun nam tay ngắn là dòng sản phẩm thời trang cao cấp, được đội ngũ thiết kế Routine chăm chút tỉ mỉ trong từng đường kim mũi chỉ, chú trọng đến từng chi tiết dù là nhỏ nhất. Sản phẩm sở hữu những đặc tính vượt trội mà chắc chắn bạn sẽ yêu thích",
			Price:         245000,
			DiscountPrice: floatPtr(199000),
			Slug:          "ao-thun-nam",
			IsActive:      true,
			Images: makeImages(
				"https://media.routine.vn/1200x1500/prod/media/10f24tss003c-white-ao-thun-tay-ngan-nam-2-jpg-ccg6.webp",
				"https://media.routine.vn/1200x1500/prod/media/10f24tss003c-white-ao-thun-tay-ngan-nam-1-jpg-tuiw.webp",
			),
			Variants: []models.ProductVariant{
				{Size: "S", Color: "Trắng", StockQuantity: 50, SKU: "ATBN-S-W"},
				{Size: "M", Color: "Trắng", StockQuantity: 100, SKU: "ATBN-M-W"},
				{Size: "L", Color: "Trắng", StockQuantity: 80, SKU: "ATBN-L-W"},
				{Size: "S", Color: "Đen", StockQuantity: 60, SKU: "ATBN-S-B"},
				{Size: "M", Color: "Đen", StockQuantity: 120, SKU: "ATBN-M-B"},
				{Size: "L", Color: "Đen", StockQuantity: 90, SKU: "ATBN-L-B"},
			},
		},
		{
			CategoryID:    categories[0].ID,
			Name:          "Áo Thun Nam Tay Ngắn Vải Cafe Trơn Form Fitted",
			Description:   "Áo thun nam tay ngắn, chất liệu vải cafe thân thiện môi trường, phom dáng fitted tôn dáng, thoáng mát và khử mùi tốt.",
			Price:         422000,
			DiscountPrice: nil, // Hiện tại sản phẩm không hiển thị giá giảm
			Slug:          "ao-thun-nam-tay-ngan-vai-cafe-tron-form-fitted",
			IsActive:      true,
			Images: makeImages(
				"https://media.routine.vn/1200x1500/prod/variant/10s25tss079-black-1-jpg-nrdd.webp",
				"https://media.routine.vn/1200x1500/prod/variant/10s25tss079-black-2-jpg-fhtr.webp",
			),
			Variants: []models.ProductVariant{
				{Size: "S", Color: "Black", StockQuantity: 50, SKU: "10S25TSS079-S-BK"},
				{Size: "M", Color: "Black", StockQuantity: 50, SKU: "10S25TSS079-M-BK"},
				{Size: "L", Color: "Black", StockQuantity: 50, SKU: "10S25TSS079-L-BK"},
				{Size: "XL", Color: "Black", StockQuantity: 50, SKU: "10S25TSS079-XL-BK"},
				{Size: "S", Color: "Brown", StockQuantity: 40, SKU: "10S25TSS079-S-BR"},
				{Size: "M", Color: "Brown", StockQuantity: 40, SKU: "10S25TSS079-M-BR"},
				{Size: "L", Color: "Brown", StockQuantity: 40, SKU: "10S25TSS079-L-BR"},
				{Size: "S", Color: "Bright White", StockQuantity: 60, SKU: "10S25TSS079-S-WH"},
				{Size: "M", Color: "Bright White", StockQuantity: 60, SKU: "10S25TSS079-M-WH"},
				{Size: "L", Color: "Bright White", StockQuantity: 60, SKU: "10S25TSS079-L-WH"},
				{Size: "S", Color: "Oatmeal", StockQuantity: 30, SKU: "10S25TSS079-S-OT"},
				{Size: "M", Color: "Oatmeal", StockQuantity: 30, SKU: "10S25TSS079-M-OT"},
			},
		},
		{
			CategoryID:    categories[0].ID,
			Name:          "Áo Thun Nam Tay Ngắn In Hình Form Boxy",
			Description:   "Áo thun nam tay ngắn, thiết kế in hình cá tính, phom dáng Boxy rộng rãi, thoải mái và năng động.",
			Price:         343000,
			DiscountPrice: nil,
			Slug:          "ao-thun-nam-tay-ngan-in-hinh-form-boxy",
			IsActive:      true,
			Images: makeImages(
				"https://media.routine.vn/1200x1500/prod/variant/10s25tss060-grey-1-jpg-fa08.webp",
				"https://media.routine.vn/1200x1500/prod/variant/10s25tss060-grey-2-jpg-vwlq.webp",
			),
			Variants: []models.ProductVariant{
				{Size: "S", Color: "Grey", StockQuantity: 50, SKU: "10S25TSS060-S-GR"},
				{Size: "M", Color: "Grey", StockQuantity: 50, SKU: "10S25TSS060-M-GR"},
				{Size: "L", Color: "Grey", StockQuantity: 50, SKU: "10S25TSS060-L-GR"},
				{Size: "S", Color: "Black", StockQuantity: 50, SKU: "10S25TSS060-S-BK"},
				{Size: "M", Color: "Black", StockQuantity: 50, SKU: "10S25TSS060-M-BK"},
				{Size: "L", Color: "Black", StockQuantity: 50, SKU: "10S25TSS060-L-BK"},
			},
		},
		{
			CategoryID:    categories[0].ID,
			Name:          "Áo Thun Nam Tay Ngắn Sọc Ngang Form Regular",
			Description:   "Áo thun nam tay ngắn phom Regular vừa vặn, họa tiết sọc ngang cổ điển nhưng không lỗi mốt, dễ dàng phối đồ.",
			Price:         343000, // Giá tham khảo cho dòng Regular
			DiscountPrice: nil,
			Slug:          "ao-thun-tay-ngan-nam-soc-ngang-regular-036",
			IsActive:      true,
			Images: makeImages(
				"https://media.routine.vn/1200x1500/prod/variant/10f25tss036-white-navy-2-jpg-bjb9.webp",
				"https://media.routine.vn/1200x1500/prod/variant/10f25tss036-white-navy-4-jpg-pe03.webp",
				"https://media.routine.vn/1200x1500/prod/variant/10f25tss036-white-navy-3-jpg-5cmx.webp",
			),
			Variants: []models.ProductVariant{
				// Giả định màu Black (Sọc đen) và White (Sọc trắng)
				{Size: "S", Color: "Black", StockQuantity: 40, SKU: "10S25TSS036-S-BK"},
				{Size: "M", Color: "Black", StockQuantity: 40, SKU: "10S25TSS036-M-BK"},
				{Size: "L", Color: "Black", StockQuantity: 40, SKU: "10S25TSS036-L-BK"},
				{Size: "XL", Color: "Black", StockQuantity: 40, SKU: "10S25TSS036-XL-BK"},
				{Size: "S", Color: "White", StockQuantity: 40, SKU: "10S25TSS036-S-WH"},
				{Size: "M", Color: "White", StockQuantity: 40, SKU: "10S25TSS036-M-WH"},
			},
		},
		{
			CategoryID:    categories[0].ID,
			Name:          "Áo Thun Nam Tay Ngắn Hình In Form Boxy",
			Description:   "Áo thun phom Boxy rộng rãi, thoải mái, nổi bật với hình in graphic sắc nét, mang phong cách trẻ trung năng động.",
			Price:         399000, // Giá tham khảo cho dòng Boxy in hình
			DiscountPrice: nil,
			Slug:          "ao-thun-tay-ngan-nam-hinh-in-boxy-016",
			IsActive:      true,
			Images: makeImages(
				"https://media.routine.vn/1200x1500/prod/variant/10f25tss016-red-2-jpg-6v03.webp",
				"https://media.routine.vn/1200x1500/prod/variant/10f25tss016-red-5-jpg-qn6i.webp",
				"https://media.routine.vn/1200x1500/prod/variant/10f25tss016-red-3-jpg-vb18.webp",
				"https://media.routine.vn/1200x1500/prod/variant/10f25tss016-red-4-jpg-hemz.webp",
			),
			Variants: []models.ProductVariant{
				// Giả định màu Beige (Be) và Black (Đen)
				{Size: "S", Color: "Beige", StockQuantity: 30, SKU: "10S25TSS016-S-BE"},
				{Size: "M", Color: "Beige", StockQuantity: 50, SKU: "10S25TSS016-M-BE"},
				{Size: "L", Color: "Beige", StockQuantity: 40, SKU: "10S25TSS016-L-BE"},
				{Size: "S", Color: "Black", StockQuantity: 30, SKU: "10S25TSS016-S-BK"},
				{Size: "M", Color: "Black", StockQuantity: 50, SKU: "10S25TSS016-M-BK"},
			},
		},

		// Quần nam
		{
			CategoryID:  categories[1].ID,
			Name:        "Quần jean nam slim fit",
			Description: "Quần jean nam form slim, chất liệu denim co giãn nhẹ",
			Price:       499000,
			Slug:        "quan-jean-nam-slim-fit",
			IsActive:    true,
			Images:      makeImages("https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"),
			Variants: []models.ProductVariant{
				{Size: "29", Color: "Xanh đậm", StockQuantity: 40, SKU: "QJN-29-DB"},
				{Size: "30", Color: "Xanh đậm", StockQuantity: 60, SKU: "QJN-30-DB"},
				{Size: "31", Color: "Xanh đậm", StockQuantity: 55, SKU: "QJN-31-DB"},
				{Size: "32", Color: "Xanh đậm", StockQuantity: 50, SKU: "QJN-32-DB"},
			},
		},
		{
			CategoryID:    categories[1].ID,
			Name:          "Quần kaki nam",
			Description:   "Quần kaki nam form regular, chất liệu kaki mềm mại",
			Price:         349000,
			DiscountPrice: floatPtr(279000),
			Slug:          "quan-kaki-nam",
			IsActive:      true,
			Images:        makeImages("https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500"),
			Variants: []models.ProductVariant{
				{Size: "29", Color: "Be", StockQuantity: 45, SKU: "QKN-29-BE"},
				{Size: "30", Color: "Be", StockQuantity: 70, SKU: "QKN-30-BE"},
				{Size: "31", Color: "Be", StockQuantity: 60, SKU: "QKN-31-BE"},
				{Size: "29", Color: "Xanh navy", StockQuantity: 40, SKU: "QKN-29-NV"},
				{Size: "30", Color: "Xanh navy", StockQuantity: 65, SKU: "QKN-30-NV"},
			},
		},

		// Áo nữ
		{
			CategoryID:    categories[2].ID,
			Name:          "Áo sơ mi nữ trắng",
			Description:   "Áo sơ mi nữ chất liệu voan, thiết kế thanh lịch",
			Price:         299000,
			DiscountPrice: floatPtr(249000),
			Slug:          "ao-so-mi-nu-trang",
			IsActive:      true,
			Images:        makeImages("https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500"),
			Variants: []models.ProductVariant{
				{Size: "S", Color: "Trắng", StockQuantity: 80, SKU: "ASMNU-S-W"},
				{Size: "M", Color: "Trắng", StockQuantity: 100, SKU: "ASMNU-M-W"},
				{Size: "L", Color: "Trắng", StockQuantity: 70, SKU: "ASMNU-L-W"},
			},
		},
		{
			CategoryID:  categories[2].ID,
			Name:        "Áo kiểu nữ hoa nhí",
			Description: "Áo kiểu nữ họa tiết hoa nhí, phong cách vintage",
			Price:       359000,
			Slug:        "ao-kieu-nu-hoa-nhi",
			IsActive:    true,
			Images:      makeImages("https://images.unsplash.com/photo-1564257577054-d5c7f2d0877f?w=500"),
			Variants: []models.ProductVariant{
				{Size: "S", Color: "Hồng", StockQuantity: 55, SKU: "AKNU-S-P"},
				{Size: "M", Color: "Hồng", StockQuantity: 75, SKU: "AKNU-M-P"},
				{Size: "L", Color: "Hồng", StockQuantity: 60, SKU: "AKNU-L-P"},
			},
		},

		// Quần nữ
		{
			CategoryID:  categories[3].ID,
			Name:        "Quần jean nữ skinny",
			Description: "Quần jean nữ form skinny ôm dáng, co giãn tốt",
			Price:       449000,
			Slug:        "quan-jean-nu-skinny",
			IsActive:    true,
			Images:      makeImages("https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500"),
			Variants: []models.ProductVariant{
				{Size: "26", Color: "Xanh nhạt", StockQuantity: 50, SKU: "QJNU-26-LB"},
				{Size: "27", Color: "Xanh nhạt", StockQuantity: 70, SKU: "QJNU-27-LB"},
				{Size: "28", Color: "Xanh nhạt", StockQuantity: 65, SKU: "QJNU-28-LB"},
				{Size: "29", Color: "Xanh nhạt", StockQuantity: 55, SKU: "QJNU-29-LB"},
			},
		},
		{
			CategoryID:    categories[3].ID,
			Name:          "Quần culottes nữ",
			Description:   "Quần culottes nữ lưng cao, chất liệu vải thoáng mát",
			Price:         329000,
			DiscountPrice: floatPtr(249000),
			Slug:          "quan-culottes-nu",
			IsActive:      true,
			Images:        makeImages("https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"),
			Variants: []models.ProductVariant{
				{Size: "S", Color: "Đen", StockQuantity: 60, SKU: "QCNU-S-B"},
				{Size: "M", Color: "Đen", StockQuantity: 80, SKU: "QCNU-M-B"},
				{Size: "L", Color: "Đen", StockQuantity: 70, SKU: "QCNU-L-B"},
				{Size: "S", Color: "Be", StockQuantity: 45, SKU: "QCNU-S-BE"},
				{Size: "M", Color: "Be", StockQuantity: 65, SKU: "QCNU-M-BE"},
			},
		},

		// Phụ kiện
		{
			CategoryID:  categories[4].ID,
			Name:        "Nón bucket unisex",
			Description: "Nón bucket phong cách streetwear, chất liệu vải bền đẹp",
			Price:       149000,
			Slug:        "non-bucket-unisex",
			IsActive:    true,
			Images:      makeImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500"),
			Variants: []models.ProductVariant{
				{Size: "Free size", Color: "Đen", StockQuantity: 100, SKU: "NBU-FS-B"},
				{Size: "Free size", Color: "Be", StockQuantity: 80, SKU: "NBU-FS-BE"},
				{Size: "Free size", Color: "Xanh navy", StockQuantity: 70, SKU: "NBU-FS-NV"},
			},
		},
		{
			CategoryID:  categories[4].ID,
			Name:        "Túi tote canvas",
			Description: "Túi tote vải canvas bền đẹp, thiết kế đơn giản",
			Price:       199000,
			Slug:        "tui-tote-canvas",
			IsActive:    true,
			Images:      makeImages("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"),
			Variants: []models.ProductVariant{
				{Size: "Free size", Color: "Trắng", StockQuantity: 120, SKU: "TTC-FS-W"},
				{Size: "Free size", Color: "Đen", StockQuantity: 100, SKU: "TTC-FS-B"},
				{Size: "Free size", Color: "Be", StockQuantity: 90, SKU: "TTC-FS-BE"},
			},
		},
	}

	return db.Create(&products).Error
}

func seedAddresses(db *gorm.DB) error {
	log.Println("Seeding addresses...")

	var count int64
	db.Model(&models.Address{}).Count(&count)
	if count > 0 {
		log.Println("Addresses already exist, skipping...")
		return nil
	}

	// Get users
	var users []models.User
	if err := db.Find(&users).Error; err != nil {
		return err
	}

	// Find user1 and user2 (skip admin)
	var user1, user2 models.User
	for _, u := range users {
		switch u.Email {
		case "user1@example.com":
			user1 = u
		case "user2@example.com":
			user2 = u
		}
	}
	if user1.ID == 0 || user2.ID == 0 {
		return fmt.Errorf("seed users not found for addresses")
	}

	addresses := []models.Address{
		{
			UserID:        user1.ID,
			FullName:      "Nguyễn Văn A",
			Phone:         "0912345678",
			Province:      "Hồ Chí Minh",
			District:      "Quận 1",
			Ward:          "Phường Bến Nghé",
			DetailAddress: "123 Đường Lê Lợi",
			IsDefault:     true,
		},
		{
			UserID:        user1.ID,
			FullName:      "Nguyễn Văn A",
			Phone:         "0912345678",
			Province:      "Hồ Chí Minh",
			District:      "Quận 3",
			Ward:          "Phường 1",
			DetailAddress: "456 Đường Võ Văn Tần",
			IsDefault:     false,
		},
		{
			UserID:        user2.ID,
			FullName:      "Trần Thị B",
			Phone:         "0923456789",
			Province:      "Hà Nội",
			District:      "Quận Ba Đình",
			Ward:          "Phường Điện Biên",
			DetailAddress: "789 Đường Hoàng Diệu",
			IsDefault:     true,
		},
	}

	return db.Create(&addresses).Error
}

func floatPtr(f float64) *float64 {
	return &f
}

func makeImages(primary string, others ...string) []models.ProductImage {
	images := []models.ProductImage{{ImageURL: primary, IsPrimary: true}}
	for _, url := range others {
		images = append(images, models.ProductImage{ImageURL: url, IsPrimary: false})
	}
	return images
}
