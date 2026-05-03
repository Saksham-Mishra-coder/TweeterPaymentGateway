import api from './api.js';

export const createOrder = async (orderData) => {
  return await api.post('/payment/create-order', orderData);
};

export const verifyPayment = async (paymentData) => {
  return await api.post('/payment/verify-payment', paymentData);
};
