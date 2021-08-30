type config = {headers: {authorization: string}};

export default function addUserToken(config: config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config
} 
