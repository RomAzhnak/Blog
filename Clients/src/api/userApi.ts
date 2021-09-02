import axios from "axios";
import { User } from "../redux/userSlice";
// import { useAppDispatch } from '../app/hooks';
// import { addUser } from "../redux/userSlice";

export const getUserByToken = async (token: string) => {
  return {
    id: 1,
    name: 'asd'
  }
};

const instance = axios.create({
  baseURL: 'localhost'
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  } else {
    config.headers.authorization = 'TEST'
  }
  return config;
});

export const fetchAddUser = (user: User): Promise<any> => {
  return instance.post("/auth/signup", JSON.stringify({ user }));
}

export const fetchLoginUser = (user: User): Promise<any> => {
  return instance.post("/auth/signin", JSON.stringify({ user }));
}

// export const userSignUp = async (user: User) => {
//   try {
//     const resp = await instance.post("/auth/signup", JSON.stringify({ user }));
//   } catch (error) {

//   }
// };

// export const userSignIn = async (user: User) => {
//   try {
//     const resp = await instance.post("/auth/signin", JSON.stringify({ user }));
//     console.log(resp);
//     localStorage.setItem('token', resp.data.accessToken)
//   } catch (error) {

//   }
// };

// export const userReLogin = async () => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     try {
//       const resp = await instance.get("/auth");
//       const user = resp.data.json();

//     } catch (error) {
//       localStorage.removeItem("token");
//     }
//   }
// }
