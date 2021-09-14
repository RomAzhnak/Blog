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

export const changeLike = (data: any) => {
  instance.post('/auth/like', data); 
}

export const fetchGet = (): Promise<any> => {
  return instance.get('/auth');
}

export const getUserList = (email: string): Promise<any>  => {
  return instance.get(`/auth/users?email=${email}`);
}

export const getPosts = (id: string): Promise<any>  => {
  return instance.get(`/auth/user/posts/${id}`);
}

export const getUser = (id: string): Promise<any>  => {
  return instance.get(`/auth/user/${id}`);
}

export const fetchAddUser = (user: User): Promise<any> => {
  return instance.post("/auth/signup", user);
}

export const fetchLoginUser = (user: User): Promise<any> => {
  return instance.post("/auth/signin", user);
  // return new Promise((res, rej) => {
  //   setTimeout(() => {
  //     res({
  //       data: {
  //         userName: user.userName,
  //         email: user.email,
  //         accessToken: 'token'
  //       }
  //     })
  //   }, 100)
  // })
}

export const fetchAvatar = (file: FormData): Promise<any> => {
  return instance.post("/auth/upload", file, {
    headers: {
      "Content-Type": "multipart/form-data",
      "user": file.get('user')
    },
  });
}

export const fetchEditUser = (formData: FormData): Promise<any> => {
  return instance.post("/auth/edit", formData
  , {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // headers: {
    //   "Content-Type": "multipart/form-data",
    //   "userName": file.get('userName'),
    //   "email": file.get('email'),
    //   "password": file.get('password'),
    //   "urlAvatar": file.get('urlAvatar'),
    //   "role": 2
    // },
  });
}

export const fetchDelUser = (user: User): Promise<any> => {
  return instance.delete('/auth', {
    params: {
      email: user.email,
      password: user.password
    }
  })
}

export default instance;


function params(arg0: string, params: any, arg2: { email: string; }): Promise<any> {
  throw new Error("Function not implemented.");
}
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
