import api from './api';

export const login = async (username, password) => {
  const response = await api.post(
    '/login/',
    { username, password },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/register/', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};