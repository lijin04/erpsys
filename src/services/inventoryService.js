import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getInventoryRecords = async (productId) => {
  const response = await axios.get(`${API_URL}/inventory/${productId}`);
  return response.data;
}; 