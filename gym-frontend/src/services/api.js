import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getUsers = async (search = '') => {
  const url = search ? `/users?search=${search}` : '/users';
  const response = await api.get(url);
  return response.data;
};

export const getExpiringUsers = async (days = 5) => {
  const response = await api.get(`/users/expiring?days=${days}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/users/stats');
  return response.data;
};

export const renewUser = async (id, renewData) => {
  const response = await api.put(`/users/${id}/renew`, renewData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default api;
