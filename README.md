EduManager — Hệ Thống Quản Lý Sinh Viên

Môn học: Lập Trình Web và Ứng Dụng (503073)  
Công nghệ: NestJS · TypeORM · PostgreSQL · React · Vite · Ant Design


Link video demo: _[Dán link YouTube / Google Drive vào đây]_

Yêu Cầu Cài Đặt

Trước khi chạy dự án, hãy đảm bảo máy tính của bạn đã cài đặt đủ ba công cụ sau:

Node.js phiên bản 18.x LTS trở lên — kiểm tra bằng `node -v`
npm phiên bản 9.x trở lên — kiểm tra bằng `npm -v`
PostgreSQL phiên bản 14.x trở lên — kiểm tra bằng `psql --version`


Hướng Dẫn Chạy Dự Án

Bước 1 — Tạo Database

Mở pgAdmin 4 hoặc terminal (PowerShell) để tạo database.
 
 Cách 1: Sử dụng pgAdmin 4 (Khuyến nghị)
 1. Mở phần mềm pgAdmin 4 và đăng nhập bằng tài khoản `postgres` (mật khẩu mặc định: `123456`).
 2. Ở cột bên trái, mở rộng `Servers` -> `PostgreSQL 14` (hoặc phiên bản bạn cài).
 3. Click chuột phải vào mục `Databases` -> Chọn `Create` -> `Database...`
 4. Ở ô `Database`, nhập chính xác tên: `student_management`
 5. Nhấn `Save` để tạo database.
 
 Cách 2: Sử dụng dòng lệnh (PowerShell)
 Mở PowerShell, di chuyển đến thư mục gốc của dự án `student-management` và chạy:
 $env:PGPASSWORD = "123456"
 psql -U postgres -c "CREATE DATABASE student_management;"

Bước 2 — Cài đặt và Chạy Backend

cd backend
npm install
copy .env.example .env

Sau khi sao chép file `.env`, mở nó ra và kiểm tra lại các thông số kết nối database:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=student_management
JWT_SECRET=student-management-super-secret-key-2026
PORT=3000

Khi đã chắc chắn thông tin đúng, khởi động backend: npm run start:dev

Backend khởi động thành công khi terminal hiển thị:
Backend running at: http://localhost:3000
Swagger UI at:      http://localhost:3000/api-docs
Lưu ý: Giữ nguyên terminal này đang chạy, đừng đóng lại.

Bước 3 — Nhập Dữ Liệu Demo

Mở một terminal **mới** (không đóng terminal backend), quay về thư mục gốc rồi chạy script seed:

cd ..
$env:PGPASSWORD = "123456"
$env:PATH += ";D:\PostpreSQL\bin"   # Thay đường dẫn PostgreSQL nếu khác
psql -U postgres -d student_management -f seed_demo.sql

Seed thành công khi terminal in ra các dòng như `INSERT 0 8` (sinh viên), `INSERT 0 11` (điểm số), v.v.

---

### Bước 4 — Cài đặt và Chạy Frontend

Mở thêm một terminal **mới**, từ thư mục gốc chạy:

cd frontend
npm install
npm run dev

Frontend sẵn sàng khi bạn thấy:
VITE v5.x.x  ready in ...ms
Local:   http://localhost:5173/

Truy Cập Ứng Dụng

Sau khi cả backend lẫn frontend đều đang chạy, bạn có thể truy cập:

Giao diện người dùng: http://localhost:5173
Swagger UI (tài liệu & test API): http://localhost:3000/api-docs
Base URL của REST API: http://localhost:3000/api

Tài Khoản Đăng Nhập

Sau khi chạy seed data ở Bước 3, hệ thống có sẵn 3 tài khoản với các cấp quyền khác nhau:

Admin: 
    Tài khoản: `admin`
    Mật khẩu: `123456`
    Quyền hạn: Toàn quyền CRUD 
Giảng viên:
    Tài khoản: `teacher01`
    Mật khẩu: `123456`
    Quyền hạn: Xem & nhập điểm 
Sinh viên:
    Tài khoản: `student01`
    Mật khẩu: `123456`
    Quyền hạn: Xem thông tin cá nhân 

Nên dùng tài khoản `admin` để trải nghiệm đầy đủ các tính năng.



Tính Năng Chính

Dự án bao gồm 10 tính năng, tất cả đều có cả backend API lẫn giao diện frontend:

1. Đăng ký / Đăng nhập với xác thực JWT và mã hoá mật khẩu bằng bcrypt
2. Phân quyền 3 cấp — admin, giảng viên, sinh viên
3. Quản lý Sinh viên — CRUD đầy đủ, tìm kiếm, phân trang
4. Quản lý Khoa
5. Quản lý Lớp học
6. Quản lý Môn học
7. Đăng ký môn học theo từng học kỳ
8. Bảng điểm — tự động tính điểm và xếp loại
9. Dashboard thống kê tổng quan hệ thống
10. Swagger API Documentation với 29 endpoints (chỉ có backend)

