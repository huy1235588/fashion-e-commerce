# Change: Soạn thảo báo cáo luận án tốt nghiệp

## Why

Dự án Fashion E-Commerce cần có báo cáo luận án tốt nghiệp hoàn chỉnh theo quy định của Trường Cao đẳng Bách Khoa Sài Gòn. Báo cáo cần được cấu trúc rõ ràng theo 3 chương chính, sử dụng văn phong học thuật chuyên nghiệp, và phản ánh đúng các chức năng đã triển khai thực tế trong hệ thống.

## What Changes

- Tạo cấu trúc thư mục `docs/reports/thesis/` chứa các file Markdown cho từng phần báo cáo
- Soạn nội dung Chương 1: Tổng quan về dự án
- Soạn nội dung Chương 2: Cơ sở lý thuyết và tổng quan công nghệ
- Soạn nội dung Chương 3: Phân tích, thiết kế và triển khai hệ thống
- Soạn các phần phụ trợ: Lời mở đầu, Kết luận, Tài liệu tham khảo
- Tạo placeholder cho hình ảnh với mô tả chi tiết yêu cầu

## Impact

- Affected specs: Không ảnh hưởng đến spec kỹ thuật (đây là tài liệu báo cáo)
- Affected code: Không thay đổi source code
- Affected docs: Tạo mới thư mục `docs/reports/thesis/` với các file Markdown

## Deliverables

### Cấu trúc thư mục đề xuất

```
docs/reports/thesis/
├── README.md                    # Hướng dẫn sử dụng và compile báo cáo
├── 00_front_matter/
│   ├── title_page.md           # Trang bìa trong
│   ├── preface.md              # Lời mở đầu
│   ├── acknowledgment.md       # Lời cảm ơn
│   ├── list_of_figures.md      # Danh mục hình ảnh
│   ├── list_of_tables.md       # Danh mục bảng biểu
│   ├── abbreviations.md        # Danh mục từ viết tắt
│   └── table_of_contents.md    # Mục lục
├── chapter_1/
│   ├── README.md               # Dàn ý tổng quát Chương 1
│   ├── 1.1_introduction.md     # Giới thiệu đề tài và bài toán
│   ├── 1.2_user_roles.md       # Đối tượng sử dụng và phân quyền
│   ├── 1.3_scope.md            # Phạm vi chức năng đã triển khai
│   ├── 1.4_architecture.md     # Kiến trúc tổng thể hệ thống
│   └── 1.5_tech_stack.md       # Công nghệ sử dụng
├── chapter_2/
│   ├── README.md               # Dàn ý tổng quát Chương 2
│   ├── 2.1_ecommerce.md        # Tổng quan về thương mại điện tử
│   ├── 2.2_market_survey.md    # Khảo sát các hệ thống tương tự
│   └── 2.3_technologies/
│       ├── README.md           # Giới thiệu phần công nghệ
│       ├── 2.3.1_golang.md     # Backend: Golang
│       ├── 2.3.2_gin.md        # Backend Framework: Gin
│       ├── 2.3.3_gorm.md       # ORM: GORM
│       ├── 2.3.4_postgresql.md # Database: PostgreSQL
│       ├── 2.3.5_nextjs.md     # Frontend Framework: Next.js
│       ├── 2.3.6_tailwind.md   # UI: Tailwind CSS
│       ├── 2.3.7_zustand.md    # State Management: Zustand
│       ├── 2.3.8_axios.md      # HTTP Client: Axios
│       ├── 2.3.9_jwt.md        # Bảo mật: JWT
│       └── 2.3.10_devops.md    # DevOps/Tools
├── chapter_3/
│   ├── README.md               # Dàn ý tổng quát Chương 3
│   ├── 3.1_requirements.md     # Phân tích yêu cầu hệ thống
│   ├── 3.2_business_process.md # Đặc tả quy trình nghiệp vụ
│   ├── 3.3_system_design/
│   │   ├── README.md           # Tổng quan thiết kế
│   │   ├── 3.3.1_database.md   # Thiết kế dữ liệu (ERD)
│   │   ├── 3.3.2_sequence.md   # Sơ đồ tuần tự
│   │   └── 3.3.3_architecture.md # Thiết kế kiến trúc
│   ├── 3.4_environment.md      # Môi trường và công cụ phát triển
│   ├── 3.5_code_structure.md   # Tổ chức mã nguồn
│   ├── 3.6_implementation.md   # Xây dựng các chức năng chính
│   ├── 3.7_ui_results.md       # Kết quả giao diện hệ thống
│   ├── 3.8_deployment.md       # Triển khai hệ thống
│   └── 3.9_evaluation.md       # Đánh giá kết quả và hướng phát triển
├── 04_back_matter/
│   ├── conclusion.md           # Phần kết luận
│   ├── references.md           # Tài liệu tham khảo
│   └── appendix.md             # Phụ lục
└── assets/
    └── placeholders/           # Thư mục chứa mô tả placeholder hình ảnh
```

## Constraints

### Yêu cầu về văn phong
- Sử dụng văn phong học thuật, chuyên nghiệp với câu văn hoàn chỉnh
- Tránh liệt kê gạch đầu dòng quá nhiều, chỉ dùng khi thực sự cần thiết
- Tránh các từ sáo rỗng như "trong bối cảnh hiện nay", "toàn diện", "tối ưu hóa trải nghiệm"
- Đi thẳng vào vấn đề kỹ thuật

### Yêu cầu về ngôn ngữ
- Ưu tiên sử dụng tiếng Việt trong toàn bộ nội dung
- Chỉ giữ tiếng Anh cho thuật ngữ kỹ thuật chuyên ngành (API, Framework, Database)
- Dịch các vai trò: Admin → quản trị viên, Customer → khách hàng, Manager → quản lý

### Yêu cầu về hình ảnh
- Mỗi hình ảnh có placeholder với mô tả chi tiết trong ngoặc vuông
- Định dạng: `[HÌNH X.Y: Mô tả. Yêu cầu: Hướng dẫn chụp/vẽ cụ thể]`
- Chú thích dưới mỗi hình ảnh bắt buộc

## Out of Scope

- Compile/export sang định dạng DOCX hoặc PDF
- Vẽ sơ đồ thực tế (chỉ tạo placeholder và mô tả)
- Chụp màn hình thực tế (chỉ tạo placeholder và hướng dẫn)
