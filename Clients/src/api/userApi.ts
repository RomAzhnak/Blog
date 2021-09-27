import axios from "axios";
import { User } from "../redux/userSlice";

const instance = axios.create({
  baseURL: 'http://localhost:4000/'
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  } else {

  }
  return config;
});

export const changeSubscribeToUser = (id: number): Promise<any>  => {
  return instance.get(`/user/usersubcribe?id=${id}`);
}

export const getUserPostList = (page: number, filter: string): Promise<any> => {
  return instance.get(`/user/postlist?page=${page}&filter=${filter}`);
}

export const changeLike = (data: any): Promise<any> => {
  return instance.post('/user/like', data); 
}

export const fetchGet = (): Promise<any> => {
  return instance.get('/auth');
}

export const getUserList = (id: number): Promise<any>  => {
  return instance.get(`/user/users?id=${id}`);
}

export const getUserListAdmin = (id: number): Promise<any>  => {
  return instance.get(`/admin/users?id=${id}`);
}

export const getPosts = (id: string): Promise<any>  => {
  return instance.get(`/user/userposts/${id}`);
}

export const getUser = (id: string): Promise<any>  => {
  return instance.get(`/user/getuser/${id}`);
}

export const fetchAddUser = (user: User): Promise<any> => {
  return instance.post("/auth/signup", user);
}

export const fetchLoginUser = (user: User): Promise<any> => {
  return instance.post("/auth/signin", user);
}

export const fetchEditUser = (formData: FormData): Promise<any> => {
  return instance.post("/user/edit", formData
  , {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const fetchEditUserAdmin = (formData: FormData): Promise<any> => {
  return instance.post("/admin/editAdmin", formData
  , {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const fetchAddPost = (title: string, post: string): Promise<any> => {
  return instance.post("/user/addpost", {title, post});
}

export const fetchDelUser = (user: User): Promise<any> => {
  return instance.delete('/user', {
    params: {
      id: user.id,
      roleId: user.roleId,
      password: user.password,
    }
  })
}

export const fetchDelUserAdmin = (user: User): Promise<any> => {
  return instance.delete('/admin/deleteUser', {
    params: {
      id: user.id,
    }
  })
}

export default instance;


function params(arg0: string, params: any, arg2: { email: string; }): Promise<any> {
  throw new Error("Function not implemented.");
}
