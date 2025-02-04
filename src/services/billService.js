import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getBills = async (companyId) => {
  const response = await axios.get(`${API_URL}/bills/${companyId}`);
  return response.data;
}; 