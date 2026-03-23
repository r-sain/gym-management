import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://gym-management-opnz.onrender.com/api',
  timeout: 30000, // 30 second timeout for cold starts
});

export const pingServer = async () => {
  try {
    const response = await api.get('/ping');
    return response.data;
  } catch (error) {
    console.error("Server warming failed:", error.message);
    return null;
  }
};

export const getUsers = async (search = '') => {
  const url = search ? `/users?search=${search}` : '/users';
  const response = await api.get(url);
  return response.data;
};

export const getExpiringUsers = async (days = 5) => {
  const response = await api.get(`/users/expiring?days=${days}`);
  return response.data;
};

export const getBirthdayUsers = async (days = 3) => {
  const response = await api.get(`/users/birthdays?days=${days}`);
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

export const updatePhoto = async (id, photo) => {
  const response = await api.patch(`/users/${id}/photo`, { photo });
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default api;
