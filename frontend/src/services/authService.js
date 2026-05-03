import api from './api.js';

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const login = async (userData) => {
  return await api.post('/auth/login', userData);
};
