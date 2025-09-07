import axios, { AxiosError } from "axios";

const BASE_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const BASE_URL = `${BASE_ORIGIN}/api`;

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  tasks?: any[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  user?: User;
}

const safePost = async <T = any>(url: string, data?: any): Promise<T> => {
  try {
    const res = await axios.post<T>(`${BASE_URL}${url}`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    throw error.response?.data || { message: error.message };
  }
};

const safeGet = async <T = any>(url: string): Promise<T> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await axios.get<T>(`${BASE_URL}${url}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    throw error.response?.data || { message: error.message };
  }
};

export const login = async (data: LoginData) =>
  await safePost<ApiResponse<User>>("/login", data);

export const signup = async (data: SignupData) =>
  await safePost<ApiResponse<User>>("/signup", data);

export const getProfile = async () =>
  await safeGet<{ user: User }>("/get-profile");
