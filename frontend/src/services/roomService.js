import api from './api.js';

export const createRoom = async () => {
  const response = await api.post('/rooms/create');
  return response.data;
};

export const joinRoom = async (roomId) => {
  const response = await api.post('/rooms/join', { roomId });
  return response.data;
};

export const getRoom = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};
