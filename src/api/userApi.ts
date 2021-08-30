import axios from "axios";

export const getUserByToken = async (token: string) => {
  return {
    id: 1,
    name: 'asd'
  }
};

const instance = axios.create({
  baseURL: 'localhost'
});

interface Data {
	firstName: string,
	lastName: string,
	email: string,
	password: string
}

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  //ocalStorage.setItem("token", data.jwt)
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export const userSignUp = (data: Data) => {
  console.log();
  instance.post("/signUp", data)  //JSON.stringify({data})
}
