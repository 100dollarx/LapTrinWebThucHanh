
DELETE FROM grades;
DELETE FROM enrollments;
DELETE FROM students;
DELETE FROM courses;
DELETE FROM classes;
DELETE FROM departments;
DELETE FROM users;

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE departments_id_seq RESTART WITH 1;
ALTER SEQUENCE classes_id_seq RESTART WITH 1;
ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE enrollments_id_seq RESTART WITH 1;
ALTER SEQUENCE grades_id_seq RESTART WITH 1;

INSERT INTO users (username, password, email, role, created_at, updated_at) VALUES
(
  'admin',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin@school.edu.vn',
  'admin',
  NOW(), NOW()
),
(
  'teacher01',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'teacher01@school.edu.vn',
  'teacher',
  NOW(), NOW()
),
(
  'student01',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'student01@school.edu.vn',
  'student',
  NOW(), NOW()
);

INSERT INTO departments (dept_code, dept_name, created_at) VALUES
('CNTT', 'Công nghệ thông tin', NOW()),
('KTPM', 'Kỹ thuật phần mềm', NOW()),
('HTTT', 'Hệ thống thông tin', NOW());

INSERT INTO classes (class_code, class_name, department_id, created_at) VALUES
('CNTT2022A', 'CNTT K2022 - Lớp A', 1, NOW()),
('CNTT2022B', 'CNTT K2022 - Lớp B', 1, NOW()),
('KTPM2022A', 'KTPM K2022 - Lớp A', 2, NOW()),
('HTTT2022A', 'HTTT K2022 - Lớp A', 3, NOW());

INSERT INTO courses (course_code, course_name, credits, department_id, description, created_at) VALUES
('CS101', 'Lập Trình Căn Bản', 3, 1, 'Nhập môn lập trình với Python/C', NOW()),
('CS201', 'Cơ Sở Dữ Liệu', 3, 1, 'SQL, thiết kế CSDL quan hệ', NOW()),
('CS301', 'Lập Trình Web', 3, 2, 'HTML, CSS, JavaScript, Node.js', NOW()),
('CS302', 'Lập Trình Web Nâng Cao', 3, 2, 'NestJS, React, TypeORM', NOW()),
('CS401', 'Kiến Trúc Phần Mềm', 2, 2, 'Design patterns, Clean Architecture', NOW()),
('IS201', 'Phân Tích Hệ Thống', 3, 3, 'UML, phân tích yêu cầu hệ thống', NOW());

INSERT INTO students (student_code, full_name, date_of_birth, gender, email, phone, address, class_id, user_id, created_at, updated_at) VALUES
('52200001', 'Nguyễn Văn An',    '2004-03-15', 'male',   'an.nguyen@student.edu.vn',    '0901234561', 'Hà Nội',    1, NULL, NOW(), NOW()),
('52200002', 'Trần Thị Bình',   '2004-07-22', 'female', 'binh.tran@student.edu.vn',    '0901234562', 'Hà Nội',    1, NULL, NOW(), NOW()),
('52200003', 'Lê Văn Cường',    '2003-11-05', 'male',   'cuong.le@student.edu.vn',     '0901234563', 'Hà Nội',    2, NULL, NOW(), NOW()),
('52200004', 'Phạm Thị Dung',   '2004-01-18', 'female', 'dung.pham@student.edu.vn',    '0901234564', 'TP.HCM',    2, NULL, NOW(), NOW()),
('52200005', 'Hoàng Văn Em',    '2003-09-30', 'male',   'em.hoang@student.edu.vn',     '0901234565', 'Đà Nẵng',   3, NULL, NOW(), NOW()),
('52200006', 'Vũ Thị Phương',   '2004-05-12', 'female', 'phuong.vu@student.edu.vn',    '0901234566', 'Hải Phòng', 3, 3,    NOW(), NOW()),
('52200007', 'Đặng Văn Giang',  '2003-08-25', 'male',   'giang.dang@student.edu.vn',   '0901234567', 'Cần Thơ',   4, NULL, NOW(), NOW()),
('52200008', 'Bùi Thị Hoa',     '2004-02-14', 'female', 'hoa.bui@student.edu.vn',      '0901234568', 'Huế',       4, NULL, NOW(), NOW());

INSERT INTO enrollments (student_id, course_id, semester, status, enrolled_at) VALUES
(1, 1, '2024-2025-HK1', 'completed', NOW()),
(1, 2, '2024-2025-HK1', 'completed', NOW()),
(1, 3, '2024-2025-HK2', 'enrolled',  NOW()),

(2, 1, '2024-2025-HK1', 'completed', NOW()),
(2, 3, '2024-2025-HK2', 'completed', NOW()),
(2, 4, '2025-2026-HK1', 'enrolled',  NOW()),

(3, 1, '2024-2025-HK1', 'completed', NOW()),
(3, 2, '2024-2025-HK1', 'completed', NOW()),
(3, 4, '2025-2026-HK1', 'enrolled',  NOW()),

(4, 1, '2024-2025-HK1', 'completed', NOW()),
(4, 5, '2024-2025-HK2', 'enrolled',  NOW()),

(5, 2, '2024-2025-HK1', 'completed', NOW()),
(5, 3, '2024-2025-HK2', 'enrolled',  NOW()),

(6, 4, '2025-2026-HK1', 'enrolled',  NOW()),
(6, 5, '2025-2026-HK1', 'enrolled',  NOW()),

(7, 6, '2024-2025-HK2', 'completed', NOW()),

(8, 6, '2024-2025-HK2', 'completed', NOW()),
(8, 1, '2024-2025-HK1', 'completed', NOW());

INSERT INTO grades (enrollment_id, midterm_score, final_score, total_score, grade_letter, graded_at, updated_at) VALUES
(1,  8.0, 9.0, 8.60, 'A',  NOW(), NOW()),
(2,  7.0, 7.5, 7.30, 'B',  NOW(), NOW()),

(4,  9.0, 9.5, 9.30, 'A+', NOW(), NOW()),
(5,  8.5, 8.0, 8.20, 'B+', NOW(), NOW()),

(7,  6.0, 6.5, 6.30, 'C+', NOW(), NOW()),
(8,  4.5, 4.0, 4.20, 'D',  NOW(), NOW()),

(10, 7.5, 8.0, 7.80, 'B+', NOW(), NOW()),

(12, 5.0, 4.5, 4.70, 'D',  NOW(), NOW()),

(16, 8.0, 8.5, 8.30, 'B+', NOW(), NOW()),

(17, 9.5, 10.0, 9.80, 'A+', NOW(), NOW()),
(18, 3.0, 3.5, 3.30, 'F',  NOW(), NOW());

SELECT '=== USERS ===' AS info;
SELECT id, username, email, role FROM users;

SELECT '=== DEPARTMENTS ===' AS info;
SELECT id, dept_code, dept_name FROM departments;

SELECT '=== CLASSES ===' AS info;
SELECT id, class_code, class_name, department_id FROM classes;

SELECT '=== COURSES ===' AS info;
SELECT id, course_code, course_name, credits FROM courses;

SELECT '=== STUDENTS ===' AS info;
SELECT id, student_code, full_name, gender, class_id FROM students;

SELECT '=== ENROLLMENTS ===' AS info;
SELECT id, student_id, course_id, semester, status FROM enrollments;

SELECT '=== GRADES ===' AS info;
SELECT g.id, s.full_name, c.course_name, g.midterm_score, g.final_score, g.total_score, g.grade_letter
FROM grades g
JOIN enrollments e ON g.enrollment_id = e.id
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id
ORDER BY s.full_name;
