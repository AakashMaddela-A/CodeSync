import api from './api.js';

export const runCode = async (code, language) => {
  const response = await api.post('/code/run', { code, language });
  return response.data;
};
