import apiClient from '../lib/apiClient.js';

export type Person = {
  person_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  create_at: string;
  is_deleted: boolean;
};

export const personService = {
  async getAll(): Promise<Person[]> {
    const response = await apiClient.get('/persons/all');
    return response.data.data;
  },
};