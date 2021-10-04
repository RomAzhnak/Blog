import { AxiosResponse } from "axios";
import { User } from "../redux/userSlice";
import instance from './index';

// const instance = axios.create({
//   baseURL: 'http://3.69.48.83/api'
// });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.authorization = `Bearer ${token}`
//   }
//   return config;
// });

type Data = {
  idPost: number,
  idAuthor: string,
}

export const fetchAddUser = (user: User): Promise<AxiosResponse> => {
  return instance.post("/auth/signup", user);
}

export const fetchLoginUser = (user: User): Promise<AxiosResponse> => {
  return instance.post("/auth/signin", user);
}

export const fetchGet = (): Promise<AxiosResponse> => {
  return instance.get('/auth');
}

export const getUserList = (id: number): Promise<AxiosResponse>  => {
  return instance.get(`/user/list?id=${id}`);
}

export const changeSubscribeToUser = (id: number): Promise<AxiosResponse>  => {
  const res = instance.get(`/user/subcribe?id=${id}`);
  return res
}

export const getUser = (id: string): Promise<AxiosResponse>  => {
  return instance.get(`/user/bloger/${id}`);
}

export const fetchEditUser = (formData: FormData): Promise<AxiosResponse> => {
  return instance.post("/user/bloger", formData
  , {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const fetchDelUser = async (user: User): Promise<AxiosResponse> => {
  const response = await instance.delete('/user/bloger', {
    params: {
      id: user.id,
      roleId: user.roleId,
      password: user.password,
    }
  })
  return response.data
}

export const getUserPostList = (page: number, filter: string): Promise<AxiosResponse> => {
  return instance.get(`/post/list?page=${page}&filter=${filter}`);
}

export const changeLike = (data: Data): Promise<AxiosResponse> => {
  return instance.post('/post/like', data); 
}

export const getPosts = (id: string): Promise<AxiosResponse>  => {
  return instance.get(`/post/user/${id}`);
}

export const fetchAddPost = (title: string, post: string): Promise<AxiosResponse> => {
  return instance.post("/post/addpost", {title, post});
}

export const getUserListAdmin = (id: number): Promise<AxiosResponse>  => {
  return instance.get(`/admin/user?id=${id}`);
}

export const fetchEditUserAdmin = (formData: FormData): Promise<AxiosResponse> => {
  return instance.post("/admin/user", formData
  , {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const fetchDelUserAdmin = (user: User): Promise<AxiosResponse> => {
  return instance.delete('/admin/user', {
    params: {
      id: user.id,
    }
  })
}

export default instance
