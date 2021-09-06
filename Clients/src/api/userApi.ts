import axios from "axios";
import { User } from "../redux/userSlice";

const instance = axios.create({
  baseURL: 'http://localhost:4000/'
});

// type config = {headers: {authorization: string}};

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  } else {

  }
  return config;
});

export const fetchAddUser = (user: User): Promise<any> => {
  return instance.post("/auth/signup", user);
}

export const fetchLoginUser = (user: User): Promise<any> => {
  return instance.post("/auth/signin", user);
  // return new Promise((res, rej) => {
  //   setTimeout(() => {
  //     res({
  //       data: {
  //         username: user.userName,
  //         email: user.email,
  //         accessToken: 'token'
  //       }
  //     })
  //   }, 100)
  // })
}

export const fetchEditUser = (user: User): Promise<any> => {
  return instance.post("/auth/edit", user);
}

export const fetchDelUser = (user: any) => {
  instance.post("/auth/delete", user);
}

export default instance;

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
