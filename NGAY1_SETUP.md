# 📘 Ngày 1 — Tổng Hợp Chi Tiết Setup Dự Án

> **Dự án**: Quản Lý Sinh Viên | **Stack**: NestJS + TypeORM + PostgreSQL + React + Vite  
> **Ngày thực hiện**: 12/04/2026  
> **Trạng thái**: ✅ Hoàn thành

---

## 📁 Cấu Trúc Thư Mục Đã Tạo

```
demo/
└── student-management/          ← Thư mục gốc của toàn bộ dự án
    ├── backend/                 ← NestJS API server
    │   ├── src/
    │   │   ├── app.module.ts    ← Đã cấu hình TypeORM + ConfigModule
    │   │   ├── main.ts          ← Đã cấu hình Swagger + CORS + ValidationPipe
    │   │   ├── app.controller.ts
    │   │   └── app.service.ts
    │   ├── .env                 ← Biến môi trường (DB password, JWT secret)
    │   ├── .env.example         ← Template để commit lên Git (không có password thật)
    │   ├── .gitignore
    │   └── package.json
    ├── frontend/                ← React + Vite
    │   ├── src/
    │   │   └── api/
    │   │       └── axios.ts     ← Cấu hình axios với JWT interceptor
    │   └── package.json
    └── README.md
```

---

## 🔵 BƯỚC 1 — Tạo Thư Mục Dự Án & Khởi Tạo Git

### Lệnh đã chạy:
```powershell
mkdir student-management
cd student-management
git init
echo "# Student Management System" > README.md
git add .
git commit -m "init: project setup"
```

### Giải thích:
- `mkdir student-management` — Tạo thư mục gốc chứa toàn bộ dự án
- `git init` — Khởi tạo Git repository để quản lý version code
- Tạo `README.md` và commit đầu tiên để đánh dấu điểm bắt đầu dự án
- **Tại sao dùng Git?** → Giúp 2 thành viên làm việc song song, không ghi đè code của nhau, có thể rollback nếu lỗi

---

## 🔵 BƯỚC 2 — Cài NestJS CLI & Tạo Project Backend

### Lệnh đã chạy:
```powershell
# Cài NestJS CLI trên toàn hệ thống (chỉ cần làm 1 lần)
npm install -g @nestjs/cli

# Tạo project NestJS tên là "backend", dùng npm, không tạo git mới
nest new backend --package-manager npm --skip-git
```

### Giải thích:
- `npm install -g @nestjs/cli` — Cài NestJS CLI dưới dạng global, sau đó có thể dùng lệnh `nest` ở bất kỳ đâu
- `nest new backend` — NestJS CLI tự động tạo toàn bộ cấu trúc project, bao gồm:
  - `src/app.module.ts` — Module chính
  - `src/main.ts` — Điểm khởi chạy ứng dụng
  - `package.json` — Danh sách dependencies
  - `tsconfig.json` — Cấu hình TypeScript
  - `nest-cli.json` — Cấu hình NestJS CLI
- `--skip-git` — Không tạo git repo mới (vì đã có git ở thư mục cha)

---

## 🔵 BƯỚC 3 — Cài Dependencies Backend

### Lệnh đã chạy:
```powershell
cd backend

# Dependencies chính
npm install @nestjs/typeorm typeorm pg @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/swagger swagger-ui-express class-validator class-transformer

# Dependencies dành cho TypeScript (type definitions)
npm install -D @types/bcrypt @types/passport-jwt
```

### Giải thích từng package:

| Package | Công dụng |
|---------|-----------|
| `@nestjs/typeorm` + `typeorm` | Tích hợp TypeORM vào NestJS — giúp tương tác database |
| `pg` | Driver PostgreSQL — để TypeORM biết cách nói chuyện với PostgreSQL |
| `@nestjs/config` | Đọc file `.env` và cung cấp biến môi trường trong toàn app |
| `@nestjs/jwt` + `@nestjs/passport` + `passport` + `passport-jwt` | Bộ xác thực JWT — dùng để đăng nhập/bảo vệ route |
| `bcrypt` | Hash (mã hóa) mật khẩu người dùng trước khi lưu vào database |
| `@nestjs/swagger` + `swagger-ui-express` | Tự động tạo trang tài liệu API tại `/api-docs` |
| `class-validator` + `class-transformer` | Tự động kiểm tra và transform dữ liệu đầu vào (DTO validation) |
| `@types/bcrypt` + `@types/passport-jwt` | Type definitions cho TypeScript, giúp IDE hiểu được các thư viện JS thuần |

---

## 🔵 BƯỚC 4 — Tạo File `.env`

### File: `backend/.env`
```env
# ==============================
# DATABASE - PostgreSQL
# ==============================
DB_HOST=localhost        ← PostgreSQL chạy trên máy local
DB_PORT=5432             ← Port mặc định của PostgreSQL
DB_USERNAME=postgres     ← User mặc định khi cài PostgreSQL
DB_PASSWORD=123456       ← Mật khẩu bạn đặt khi cài
DB_NAME=student_management  ← Tên database cần kết nối

# ==============================
# JWT Authentication
# ==============================
JWT_SECRET=student-management-super-secret-key-2026
    ← Chuỗi bí mật để ký JWT token (giữ kín, không commit lên Git)
JWT_EXPIRES_IN=7d        ← Token hết hạn sau 7 ngày

# ==============================
# App
# ==============================
PORT=3000                ← Server chạy trên cổng 3000
NODE_ENV=development     ← Môi trường development
```

### Giải thích:
- **Tại sao dùng `.env`?** → Tránh hardcode thông tin nhạy cảm (password, secret key) vào code. Mỗi máy (dev, production) có thể có giá trị khác nhau
- **`.env.example`** → Là bản copy của `.env` nhưng không có giá trị thật. File này được commit lên Git để người khác biết cần điền những biến nào
- **`.gitignore` chứa `.env`** → Đảm bảo file `.env` (có password thật) không bao giờ lên Git

---

## 🔵 BƯỚC 5 — Cấu Hình `app.module.ts`

### File: `backend/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // 1. Load file .env vào toàn bộ ứng dụng
    ConfigModule.forRoot({
      isGlobal: true,      ← Không cần import lại ở từng module con
      envFilePath: '.env', ← Đường dẫn tới file .env
    }),

    // 2. Kết nối PostgreSQL thông qua TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',                              ← Loại database
        host: configService.get<string>('DB_HOST'),    ← Đọc từ .env
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], ← Tự tìm tất cả Entity
        synchronize: true,   ← Tự tạo/cập nhật bảng khi có Entity mới (chỉ dùng khi dev)
        logging: true,       ← In câu SQL ra console để debug
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Giải thích:
- **`ConfigModule.forRoot({ isGlobal: true })`** → Chỉ khai báo 1 lần, dùng được ở mọi nơi trong app
- **`TypeOrmModule.forRootAsync`** → Dùng `async` vì cần đợi `ConfigModule` load xong mới đọc được biến môi trường
- **`synchronize: true`** → Mỗi khi khởi động, TypeORM tự so sánh Entity với bảng trong DB và tạo/sửa bảng nếu cần. **⚠️ Tắt cái này khi lên production** vì có thể xóa mất dữ liệu
- **`entities: [__dirname + '/**/*.entity{.ts,.js}']`** → TypeORM tự tìm tất cả file có đuôi `.entity.ts` trong thư mục `src/`

---

## 🔵 BƯỚC 6 — Cấu Hình `main.ts`

### File: `backend/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Thêm prefix /api vào tất cả route
  app.setGlobalPrefix('api');
  // → Ví dụ: /students sẽ thành /api/students

  // 2. Cho phép Frontend (React localhost:5173) gọi API
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  // → Không có cái này, browser sẽ chặn request từ React sang NestJS (CORS error)

  // 3. Bật ValidationPipe toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             ← Tự xóa field không có trong DTO
      forbidNonWhitelisted: true,  ← Báo lỗi nếu gửi field lạ
      transform: true,             ← Tự convert string "1" thành number 1
    }),
  );
  // → Giúp validate dữ liệu đầu vào tự động, không cần viết thủ công

  // 4. Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Student Management API')
    .setDescription('API quản lý sinh viên - NestJS + TypeORM + PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth()  ← Thêm ô nhập JWT token trên giao diện Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // → Truy cập tài liệu API tại: http://localhost:3000/api-docs

  await app.listen(process.env.PORT || 3000);

  console.log(`🚀 Backend running at: http://localhost:3000`);
  console.log(`📚 Swagger UI at:      http://localhost:3000/api-docs`);
}

bootstrap();
```

### Giải thích:
- **`setGlobalPrefix('api')`** → Convention REST API — mọi endpoint đều bắt đầu bằng `/api/...`
- **`enableCors`** → Browser áp dụng chính sách Same-Origin Policy, block request từ domain khác. CORS cho phép ngoại lệ cho `localhost:5173` (React dev server)
- **`ValidationPipe`** → Kết hợp với `class-validator` trong DTO, tự động validate và trả về lỗi 400 nếu dữ liệu không hợp lệ
- **`addBearerAuth()`** → Sau khi login, người dùng paste JWT token vào Swagger để test các route cần xác thực

---

## 🔵 BƯỚC 7 — Tạo Project Frontend (React + Vite)

### Lệnh đã chạy:
```powershell
# Từ thư mục student-management/
npm create vite@latest frontend -- --template react-ts

cd frontend

# Cài thêm thư viện UI và gọi API
npm install antd @ant-design/icons axios react-router-dom
```

### Giải thích:

| Package | Công dụng |
|---------|-----------|
| `vite` | Build tool hiện đại — khởi động dev server cực nhanh (< 1 giây) |
| `react-ts` template | Tạo project React với TypeScript sẵn |
| `antd` (Ant Design) | Thư viện UI component: Table, Form, Modal, Button, ... |
| `@ant-design/icons` | Icon cho Ant Design |
| `axios` | HTTP client để gọi API — dễ dùng hơn `fetch` thuần |
| `react-router-dom` | Điều hướng trang (Login → Dashboard → Students...) |

---

## 🔵 BƯỚC 8 — Cấu Hình Axios

### File: `frontend/src/api/axios.ts`
```typescript
import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:3000/api', ← URL gốc của backend
  timeout: 10000,                        ← Timeout 10 giây
});

// Interceptor REQUEST: Chạy trước mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // → Tự đính kèm JWT token vào header mọi request
    // → Thay vì phải thêm thủ công mỗi lần gọi API
  }
  return config;
});

// Interceptor RESPONSE: Chạy sau mỗi response
api.interceptors.response.use(
  (response) => response, ← Trả về bình thường nếu success
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('access_token'); ← Xóa token cũ
      window.location.href = '/login';          ← Redirect về trang Login
    }
    return Promise.reject(error);
  },
);

export default api;
```

### Giải thích:
- **Tại sao dùng `interceptor`?** → Xử lý JWT một lần duy nhất, không cần copy-paste vào từng `axios.get()` / `axios.post()`
- **`localStorage.getItem('access_token')`** → Sau khi login, ta lưu JWT token vào localStorage. Interceptor sẽ tự đọc và gửi kèm
- **Xử lý 401** → Khi backend trả về 401 (Unauthorized), token đã hết hạn → xóa token cũ → redirect về Login. Người dùng sẽ thấy màn hình login thay vì bị treo

---

## 🔵 BƯỚC 9 — Tạo Database PostgreSQL

### Lệnh đã chạy:
```powershell
# Thêm psql vào PATH (PostgreSQL cài ở D:\PostpreSQL\)
$env:PATH += ";D:\PostpreSQL\bin"

# Đặt password vào biến môi trường (tránh nhập thủ công)
$env:PGPASSWORD = "123456"

# Tạo database
psql -U postgres -c "CREATE DATABASE student_management;"
```

### Giải thích:
- **Tại sao phải tạo database trước?** → TypeORM chỉ tự tạo **bảng (table)** trong database, không tự tạo database. Database phải tồn tại trước.
- **`-U postgres`** → Kết nối bằng user `postgres` (superuser mặc định)
- **`-c "CREATE DATABASE ..."`** → Chạy lệnh SQL trực tiếp không cần vào interactive mode
- Database đặt tên `student_management` phải khớp với `DB_NAME` trong file `.env`

---

## 🔵 BƯỚC 10 — Chạy & Test Backend

### Lệnh chạy backend:
```powershell
cd backend
npm run start:dev
```

### Giải thích `start:dev`:
- Lệnh này chạy `nest start --watch`
- **`--watch`** → NestJS tự động restart server mỗi khi bạn lưu file. Không cần Ctrl+C và chạy lại mỗi lần sửa code

### Kết quả mong đợi khi chạy thành công:
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [RoutesResolver] AppController {/api}
🚀 Backend running at: http://localhost:3000
📚 Swagger UI at:      http://localhost:3000/api-docs
```

### 3 cách test backend:

#### ① Swagger UI (khuyến nghị — dễ nhất)
Mở trình duyệt: **`http://localhost:3000/api-docs`**
- Thấy giao diện Swagger với tiêu đề "Student Management API" → ✅
- Click endpoint `GET /api` → Try it out → Execute → nhận response `"Hello World!"` → ✅

#### ② PowerShell (terminal)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api" -Method GET
# Kết quả: "Hello World!"  → ✅
```

#### ③ Postman (tool riêng)
- Mở Postman
- Tạo request: `GET http://localhost:3000/api`
- Send → Response Body: `"Hello World!"` → ✅

---

## 📊 Tóm Tắt Kết Quả Ngày 1

| Hạng mục | Trạng thái | Ghi chú |
|----------|------------|---------|
| Git repository | ✅ | Đã init, commit đầu tiên |
| NestJS project | ✅ | Tại `backend/` |
| Tất cả dependencies backend | ✅ | TypeORM, JWT, Swagger, bcrypt... |
| File `.env` | ✅ | DB credentials + JWT secret |
| `app.module.ts` | ✅ | TypeORM kết nối PostgreSQL |
| `main.ts` | ✅ | Swagger + CORS + ValidationPipe |
| PostgreSQL service | ✅ | Chạy tại `D:\PostpreSQL\` |
| Database `student_management` | ✅ | Đã tạo thành công |
| Backend server | ✅ | Chạy tại `http://localhost:3000` |
| Swagger UI | ✅ | Tại `http://localhost:3000/api-docs` |
| React + Vite project | ✅ | Tại `frontend/` |
| Ant Design + Axios + React Router | ✅ | Đã cài |
| `axios.ts` với JWT interceptor | ✅ | Tự gắn token + handle 401 |

---

## ⚠️ Lưu Ý Quan Trọng

### Mỗi lần mở máy lên cần làm:
1. **PostgreSQL** thường tự chạy cùng Windows (service auto-start). Kiểm tra bằng:
   ```powershell
   Get-Service -Name postgresql-x64-18
   # Status phải là "Running"
   ```

2. **Chạy Backend**:
   ```powershell
   cd C:\Users\ADMIN\OneDrive\Máy tính\demo\student-management\backend
   npm run start:dev
   ```

3. **Chạy Frontend** (khi cần):
   ```powershell
   cd C:\Users\ADMIN\OneDrive\Máy tính\demo\student-management\frontend
   npm run dev
   # Mở trình duyệt: http://localhost:5173
   ```

### Thêm psql vào PATH vĩnh viễn (chỉ làm 1 lần):
1. Windows + R → `sysdm.cpl` → Enter
2. Tab **Advanced** → **Environment Variables**
3. **System variables** → **Path** → **Edit** → **New**
4. Dán vào: `D:\PostpreSQL\bin`
5. OK hết → Mở terminal mới để có hiệu lực

---

## 🔜 Ngày 2 — Việc Tiếp Theo (13/04)

**Thành viên 1** sẽ làm **Auth Module**:
- Tạo `User` entity, `AuthModule`, `AuthController`, `AuthService`
- `POST /api/auth/register` — Đăng ký tài khoản mới
- `POST /api/auth/login` — Đăng nhập, nhận JWT token
- `GET /api/auth/profile` — Xem thông tin user đang đăng nhập
- `JwtAuthGuard` để bảo vệ các route cần xác thực

**Thành viên 2** sẽ làm **Trang Login UI**:
- Tạo trang Login với Ant Design Form
- Gọi API đăng nhập → lưu JWT vào localStorage
- Setup React Router với Protected Route
