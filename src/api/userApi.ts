import axios from "axios";
import { useAppDispatch } from '../app/hooks';
import { addUser } from "../redux/todoSlice";

export const getUserByToken = async (token: string) => {
  return {
    id: 1,
    name: 'asd'
  }
};

const dispatch = useAppDispatch();

const instance = axios.create({
  baseURL: 'localhost'
});

interface Data {
  userName: string,
  email: string,
  password: string
};

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config;
});

export const userSignUp = async (user: Data) => {
  try {
    const resp = await instance.post("/auth/signup", JSON.stringify({ user }));
    console.log(resp);
    dispatch(addUser(user));
    localStorage.setItem('token', resp.data.accessToken)
  } catch (error) {
    console.log(error);
  }
};

export const userSignIn = async (user: Data) => {
  try {
    const resp = await instance.post("/auth/signin", JSON.stringify({ user }));
    console.log(resp);
    dispatch(addUser(user));
    localStorage.setItem('token', resp.data.accessToken)
  } catch (error) {
    console.log(error);
  }
};

export const userReLogin = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const resp = await instance.get("/auth");
      // console.log(resp);
      const user = resp.data.json();
      dispatch(addUser(user));
    } catch (error) {
      localStorage.removeItem("token");
      console.log(error);
    }
  }
}
