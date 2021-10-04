import axios from "axios";

const instance = axios.create({
  baseURL: 'http://3.69.48.83/api'
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config;
});

export default instance;
