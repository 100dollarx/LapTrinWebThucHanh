import api from './axios';

export const departmentsApi = {
  getAll: () => api.get('/departments'),
  getOne: (id: number) => api.get(`/departments/${id}`),
  create: (data: { dept_code: string; dept_name: string }) =>
    api.post('/departments', data),
  update: (id: number, data: Partial<{ dept_code: string; dept_name: string }>) =>
    api.patch(`/departments/${id}`, data),
  delete: (id: number) => api.delete(`/departments/${id}`),
};

export const classesApi = {
  getAll: () => api.get('/classes'),
  getOne: (id: number) => api.get(`/classes/${id}`),
  create: (data: { class_code: string; class_name: string; department_id?: number }) =>
    api.post('/classes', data),
  update: (id: number, data: any) => api.patch(`/classes/${id}`, data),
  delete: (id: number) => api.delete(`/classes/${id}`),
};

export const coursesApi = {
  getAll: (search?: string) =>
    api.get('/courses', { params: search ? { search } : undefined }),
  getOne: (id: number) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: number, data: any) => api.patch(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
};

export const enrollmentsApi = {
  getAll: () => api.get('/enrollments'),
  getByStudent: (studentId: number) => api.get(`/enrollments/student/${studentId}`),
  create: (data: { student_id: number; course_id: number; semester: string }) =>
    api.post('/enrollments', data),
  batchCreate: (data: { student_id: number; course_ids: number[]; semester: string }) =>
    api.post('/enrollments/batch', data),
  update: (id: number, data: { status: string }) => api.patch(`/enrollments/${id}`, data),
  delete: (id: number) => api.delete(`/enrollments/${id}`),
};

export const gradesApi = {
  getAll: () => api.get('/grades'),
  getByStudent: (studentId: number) => api.get(`/grades/student/${studentId}`),
  create: (data: { enrollment_id: number; midterm_score?: number; final_score?: number }) =>
    api.post('/grades', data),
  update: (id: number, data: any) => api.patch(`/grades/${id}`, data),
};
