import api from './axios';

export interface StudentQuery {
  page?: number;
  limit?: number;
  search?: string;
  class_id?: number;
}

export interface CreateStudentData {
  student_code: string;
  full_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: string;
  class_id?: number;
}

export const studentsApi = {
  getAll: (params?: StudentQuery) => api.get('/students', { params }),
  getOne: (id: number) => api.get(`/students/${id}`),
  create: (data: CreateStudentData) => api.post('/students', data),
  update: (id: number, data: Partial<CreateStudentData>) =>
    api.patch(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};
