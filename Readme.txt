============================================================
           HỆ THỐNG QUẢN LÝ SINH VIÊN (EDUMANAGER)
   Tiểu luận nhóm môn: Lập Trình Web và Ứng Dụng (503073)
============================================================

Dự án này là hệ thống Quản lý Sinh viên xây dựng trên kiến trúc Modern Full-stack:
- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React + Vite + Ant Design

------------------------------------------------------------
1. YÊU CẦU HỆ THỐNG
------------------------------------------------------------
- Node.js >= 18.x
- PostgreSQL >= 14.x
- Trình duyệt Chrome / Edge (khuyến nghị)

------------------------------------------------------------
2. HƯỚNG DẪN CÀI ĐẶT (STEP-BY-STEP)
------------------------------------------------------------

Bước 1: Cài đặt và cấu hình Database
- Mở pgAdmin hoặc công cụ quản lý PostgreSQL.
- Tạo một database mới tên là: student_management

Bước 2: Cài đặt Backend
- Truy cập thư mục backend: cd backend
- Cài đặt thư viện: npm install
- Cấu hình biến môi trường:
  + Copy file .env.example thành .env
  + Chỉnh sửa các thông số DB_USERNAME, DB_PASSWORD cho đúng với PostgreSQL của bạn.
- Chạy server backend: npm run start:dev
- Server sẽ chạy tại: http://localhost:3000
- Tài liệu API (Swagger): http://localhost:3000/api-docs

Bước 3: Cài đặt Frontend
- Truy cập thư mục frontend: cd frontend
- Cài đặt thư viện: npm install
- Chạy server frontend: npm run dev
- Ứng dụng sẽ chạy tại: http://localhost:5173

------------------------------------------------------------
3. TÀI KHOẢN ĐĂNG NHẬP MẶC ĐỊNH
------------------------------------------------------------
Do cơ sở dữ liệu mới sẽ trống, bạn có thể đăng ký tài khoản mới qua trang UI hoặc 
dùng Swagger để đăng ký user admin đầu tiên:

1. Vào http://localhost:3000/api-docs
2. Tìm POST /api/auth/register
3. Nhập body mẫu:
{
  "username": "admin",
  "email": "admin@school.edu.vn",
  "password": "AdminPassword@123",
  "role": "admin"
}
4. Sau đó dùng tài khoản này đăng nhập vào UI (http://localhost:5173/login)

------------------------------------------------------------
4. CÁC TÍNH NĂNG CHÍNH
------------------------------------------------------------
- Dashboard: Thống kê tổng quan dữ liệu hệ thống.
- Quản lý Sinh viên: Thêm, sửa, xóa, tìm kiếm, phân trang sinh viên.
- Quản lý Môn học: Danh mục các môn học và số tín chỉ.
- Quản lý Lớp học & Khoa: Quản lý cơ cấu tổ chức đào tạo.
- Đăng ký môn học: Ghi nhận sinh viên tham gia các môn học theo từng học kỳ.
- Bảng điểm: Nhập điểm giữa kỳ, cuối kỳ. Hệ thống tự động tính điểm tổng và xếp loại (A+, A, B+, B...).
- Bảo mật: Xác thực qua JWT, phân quyền truy cập.

------------------------------------------------------------
5. CẤU TRÚC THƯ MỤC NỘP BÀI
------------------------------------------------------------
source/
  ├── backend/           (Toàn bộ mã nguồn phía server)
  ├── frontend/          (Toàn bộ mã nguồn phía client)
  └── db_dump.sql        (File export cơ sở dữ liệu - Cần tạo trước khi nộp)

------------------------------------------------------------
Chúc các bạn thành công và đạt kết quả cao nhất!
------------------------------------------------------------
