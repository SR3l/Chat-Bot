import axios from 'axios';
import qs from 'qs';

// const BASE_URL = 'http://localhost:8000'; // adjust as needed
const BASE_URL = 'http://156.67.82.131:9076';

const api = {
  login: async (username: string, password: string) => {
    const response = await axios.post(
      `${BASE_URL}/token`,
      qs.stringify({ username, password }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },

  signup: async (
    email: string,
    username: string,
    password: string,
    name: string
  ) => {
    const response = await axios.post(`${BASE_URL}/register`, {
      email,
      username,
      password,
      name,
    });
    return response.data;
  },
};

export default api;
