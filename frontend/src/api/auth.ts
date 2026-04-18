import api from './axios';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'teacher' | 'student';
}

export interface LoginData {
  username: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.patch('/auth/change-password', data),
};
