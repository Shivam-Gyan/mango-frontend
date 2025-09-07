import axios, { AxiosError } from "axios";

const BASE_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const BASE_URL = `${BASE_ORIGIN}/api`;

interface Task {
  _id?: string;
  title: string;
  description: string;
  completed?: boolean;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  task: T;   // make required
  tasks?: T[];
}


// 🔹 Helper for handling GET/POST/PUT/DELETE with token
const authHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const safeRequest = async <T = any>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
): Promise<T> => {
  try {
    const res = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      withCredentials: true,
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    throw error.response?.data || { message: error.message };
  }
};

// 🔹 Create Task
export const createTask = async (task: Task) =>
  await safeRequest<ApiResponse<Task>>("post", "/tasks", task);

// 🔹 Update Task
export const updateTask = async (taskId: string, task: Partial<Task>) =>
  await safeRequest<ApiResponse<Task>>("put", `/tasks/${taskId}`, task);

// 🔹 Delete Task
export const deleteTask = async (taskId: string) =>
  await safeRequest<ApiResponse<null>>("delete", `/tasks/${taskId}`);

// 🔹 Get all tasks from profile (same as getProfile)
// export const getTasks = async () =>
//   await safeRequest<ApiResponse<Task[]>>("get", "/get-profile");
