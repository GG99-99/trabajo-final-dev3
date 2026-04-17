import apiClient from '../lib/apiClient.js';
import type { LoginData, UserCredentials, CreatePerson, RegisterToken, ApiResponse } from '@final/shared';

export const authService = {
  async login(credentials: LoginData): Promise<ApiResponse<UserCredentials>> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: CreatePerson): Promise<ApiResponse<boolean>> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<UserCredentials>> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async getRegisterToken(): Promise<ApiResponse<RegisterToken>> {
    const response = await apiClient.get('/auth/register-token');
    return response.data;
  },
};