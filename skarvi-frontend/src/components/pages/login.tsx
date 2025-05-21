// src/pages/login.tsx
import axios from 'axios';

export function loginUser(username: string, password: string) {
  return axios.post('http://127.0.0.1:8000/api/token/', { username, password }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}