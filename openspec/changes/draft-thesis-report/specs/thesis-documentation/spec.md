# Capability: Tài liệu báo cáo luận án

Capability này định nghĩa cấu trúc và nội dung của báo cáo luận án tốt nghiệp cho dự án Fashion E-Commerce.

## ADDED Requirements

### Requirement: Cấu trúc báo cáo luận án

Hệ thống tài liệu báo cáo SHALL được tổ chức theo cấu trúc thư mục rõ ràng, chia theo chương và mục, hỗ trợ viết và chỉnh sửa độc lập từng phần.

#### Scenario: Tổ chức thư mục theo chương

- **GIVEN** thư mục `docs/reports/thesis/` đã được tạo
- **WHEN** người dùng truy cập cấu trúc thư mục
- **THEN** thư mục chứa các thư mục con: `00_front_matter/`, `chapter_1/`, `chapter_2/`, `chapter_3/`, `04_back_matter/`, `assets/`
- **AND** mỗi thư mục chứa các file Markdown tương ứng với từng mục trong chương

#### Scenario: Đặt tên file theo quy ước

- **GIVEN** file nội dung trong thư mục chương
- **WHEN** kiểm tra tên file
- **THEN** tên file có định dạng `<số_mục>_<tên_tiếng_anh>.md`
- **AND** file được sắp xếp theo thứ tự số mục khi liệt kê

### Requirement: Nội dung Chương 1 - Tổng quan dự án

Chương 1 SHALL trình bày tổng quan về dự án, bao gồm giới thiệu đề tài, đối tượng sử dụng, phạm vi chức năng, kiến trúc tổng thể và công nghệ sử dụng.

#### Scenario: Nội dung giới thiệu đề tài

- **GIVEN** file `chapter_1/1.1_introduction.md` tồn tại
- **WHEN** đọc nội dung file
- **THEN** file chứa mô tả ngắn gọn về website bán hàng thời trang trực tuyến
- **AND** file nêu rõ các vấn đề cần giải quyết (pain points)

#### Scenario: Nội dung phân quyền người dùng

- **GIVEN** file `chapter_1/1.2_user_roles.md` tồn tại
- **WHEN** đọc nội dung file
- **THEN** file mô tả hai đối tượng: Khách hàng (User) và Quản trị viên (Admin)
- **AND** file liệt kê quyền hạn của từng đối tượng

### Requirement: Nội dung Chương 2 - Cơ sở lý thuyết

Chương 2 SHALL trình bày cơ sở lý thuyết về thương mại điện tử, khảo sát hệ thống tương tự, và phân tích ưu nhược điểm các công nghệ sử dụng.

#### Scenario: Khảo sát hệ thống tương tự

- **GIVEN** file `chapter_2/2.2_market_survey.md` tồn tại
- **WHEN** đọc nội dung file
- **THEN** file phân tích ít nhất 3 hệ thống thương mại điện tử (Amazon, Shopee, Tiki)
- **AND** file rút ra bài học áp dụng cho đề tài

#### Scenario: Phân tích công nghệ với ưu nhược điểm

- **GIVEN** thư mục `chapter_2/2.3_technologies/` tồn tại
- **WHEN** đọc các file công nghệ
- **THEN** mỗi file chứa mục Ưu điểm và Nhược điểm của công nghệ tương ứng
- **AND** nội dung tập trung vào những điểm liên quan đến dự án

### Requirement: Nội dung Chương 3 - Phân tích và thiết kế

Chương 3 SHALL trình bày phân tích yêu cầu, thiết kế hệ thống (ERD, sơ đồ tuần tự, kiến trúc), triển khai và kết quả giao diện.

#### Scenario: Thiết kế cơ sở dữ liệu với ERD

- **GIVEN** file `chapter_3/3.3_system_design/3.3.1_database.md` tồn tại
- **WHEN** đọc nội dung file
- **THEN** file chứa placeholder cho sơ đồ ERD
- **AND** file mô tả các bảng chính: users, products, categories, orders, order_items, addresses, reviews

#### Scenario: Kết quả giao diện với placeholder hình ảnh

- **GIVEN** file `chapter_3/3.7_ui_results.md` tồn tại
- **WHEN** đọc nội dung file
- **THEN** file chứa placeholder cho các màn hình: Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm, Giỏ hàng, Thanh toán, Admin Dashboard
- **AND** mỗi placeholder có mô tả chi tiết yêu cầu chụp màn hình

### Requirement: Văn phong và ngôn ngữ

Nội dung báo cáo SHALL tuân thủ văn phong học thuật và quy ước ngôn ngữ đã định nghĩa.

#### Scenario: Văn phong học thuật

- **GIVEN** nội dung một file Markdown trong báo cáo
- **WHEN** kiểm tra văn phong
- **THEN** nội dung viết dạng đoạn văn hoàn chỉnh với chủ ngữ-vị ngữ
- **AND** nội dung không sử dụng các từ sáo rỗng: "trong bối cảnh hiện nay", "toàn diện", "tối ưu hóa trải nghiệm"

#### Scenario: Sử dụng tiếng Việt

- **GIVEN** nội dung một file Markdown trong báo cáo
- **WHEN** kiểm tra thuật ngữ
- **THEN** các vai trò được viết bằng tiếng Việt: "quản trị viên" thay vì "Admin" trong văn bản, "khách hàng" thay vì "Customer"
- **AND** chỉ giữ tiếng Anh cho thuật ngữ kỹ thuật không có từ Việt phổ biến (API, Framework, Database)

### Requirement: Placeholder hình ảnh

Mỗi vị trí cần hình ảnh minh họa SHALL có placeholder với mô tả chi tiết hướng dẫn chụp hoặc vẽ.

#### Scenario: Định dạng placeholder

- **GIVEN** vị trí cần hình ảnh trong báo cáo
- **WHEN** kiểm tra placeholder
- **THEN** placeholder có định dạng: `[HÌNH X.Y: Mô tả. Yêu cầu: Hướng dẫn cụ thể]`
- **AND** X là số chương, Y là số thứ tự hình trong chương

#### Scenario: Nội dung hướng dẫn đầy đủ

- **GIVEN** một placeholder hình ảnh
- **WHEN** đọc phần Yêu cầu
- **THEN** hướng dẫn chỉ rõ công cụ sử dụng (draw.io, StarUML, trình duyệt)
- **AND** hướng dẫn liệt kê các thành phần cần hiển thị trong hình
