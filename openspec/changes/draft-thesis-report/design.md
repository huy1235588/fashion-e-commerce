# Thiết kế: Soạn thảo báo cáo luận án tốt nghiệp

## Quyết định kiến trúc

### Cấu trúc file Markdown

Báo cáo được chia thành nhiều file Markdown nhỏ thay vì một file lớn duy nhất. Quyết định này dựa trên các tiêu chí sau:

**Phương án A: Một file duy nhất**
- Ưu điểm: Dễ compile, không cần merge
- Nhược điểm: Khó quản lý khi nội dung dài, khó phân công viết nhiều phần song song, conflict khi chỉnh sửa

**Phương án B: Chia theo chương và mục (đã chọn)**
- Ưu điểm: Dễ quản lý, dễ chỉnh sửa từng phần độc lập, hỗ trợ viết song song, dễ theo dõi tiến độ
- Nhược điểm: Cần script để merge thành file hoàn chỉnh

Lựa chọn Phương án B vì tính module hóa phù hợp với quy mô báo cáo luận án (dự kiến 50-80 trang).

### Quy ước đặt tên file

Các file được đặt tên theo quy tắc `<số_mục>_<tên_tiếng_anh>.md` để:
- Sắp xếp tự động theo thứ tự chương/mục khi liệt kê
- Dễ tham chiếu trong quá trình viết
- Giữ tên file ngắn gọn, dễ đọc trong terminal

### Thư mục assets/placeholders

Tạo thư mục riêng để lưu trữ mô tả chi tiết cho từng hình ảnh cần chụp/vẽ. Cách tiếp cận này giúp:
- Tách biệt nội dung văn bản và yêu cầu hình ảnh
- Dễ dàng theo dõi tiến độ chuẩn bị hình ảnh
- Tạo checklist rõ ràng cho sinh viên

## Quy ước nội dung

### Cấu trúc mỗi file nội dung

Mỗi file Markdown sẽ tuân theo cấu trúc:

```markdown
# [Số mục]. [Tên mục]

[Nội dung chính viết dạng đoạn văn, không liệt kê]

[HÌNH X.Y: Mô tả hình. Yêu cầu: Hướng dẫn cụ thể]

[Bảng X.Y: Tên bảng - nếu cần]
| Cột 1 | Cột 2 |
|-------|-------|
| ...   | ...   |
```

### Quy ước placeholder hình ảnh

Định dạng placeholder:
```
[HÌNH <chương>.<số thứ tự>: <Tên hình>.
Yêu cầu: <Mô tả chi tiết cách chụp/vẽ, công cụ sử dụng, các thành phần cần hiển thị>]
```

Ví dụ:
```
[HÌNH 3.1: Sơ đồ Use Case tổng quát.
Yêu cầu: Vẽ bằng draw.io hoặc StarUML, hiển thị 2 Actor (Khách hàng, Quản trị viên) 
với các Use Case chính: Đăng ký, Đăng nhập, Xem sản phẩm, Thêm giỏ hàng, 
Đặt hàng, Quản lý sản phẩm, Quản lý đơn hàng, Xem thống kê]
```

### Quy ước bảng

Các bảng so sánh công nghệ giữ ngắn gọn (4-6 tiêu chí) và tập trung vào những điểm liên quan trực tiếp đến quyết định của dự án.

## Nguồn dữ liệu

### Nội dung từ mã nguồn (📁 DỰA VÀO DỰ ÁN)

| Phần báo cáo | Nguồn tham chiếu |
|--------------|------------------|
| Kiến trúc Backend | `backend/internal/` - cấu trúc handlers/services/repositories |
| Mô hình dữ liệu | `backend/internal/models/*.go` |
| Routes Frontend | `frontend/src/app/` - cấu trúc thư mục |
| Công nghệ | `backend/go.mod`, `frontend/package.json` |
| Chức năng đã triển khai | Handlers và services hiện có |

### Nội dung cần tìm kiếm (🌐 TÌM KIẾM TRÊN MẠNG)

| Phần báo cáo | Nội dung cần tra cứu |
|--------------|----------------------|
| Lời mở đầu | Số liệu thị trường TMĐT Việt Nam/SEA (Google e-Conomy, Statista) |
| Tổng quan TMĐT | Định nghĩa B2C, quy trình giao dịch trực tuyến |
| Khảo sát hệ thống | Ưu/nhược điểm của Shopee, Tiki, Amazon |
| Công nghệ | Tài liệu chính thức của Golang, Next.js, PostgreSQL |

## Thứ tự triển khai

1. **Pha 1**: Tạo cấu trúc thư mục và file README cho từng chương
2. **Pha 2**: Soạn Chương 1 - dựa hoàn toàn vào mã nguồn dự án
3. **Pha 3**: Soạn Chương 2 - kết hợp tra cứu và phân tích dự án
4. **Pha 4**: Soạn Chương 3 - phân tích mã nguồn chi tiết
5. **Pha 5**: Soạn phần phụ trợ (Lời mở đầu, Kết luận, Tài liệu tham khảo)
6. **Pha 6**: Tạo danh sách placeholder hình ảnh hoàn chỉnh
