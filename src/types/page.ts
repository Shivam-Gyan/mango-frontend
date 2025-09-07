export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}


// Task you send when creating a new task
export interface CreateTaskInput {
  title: string;
  description: string;
  completed?: boolean; // optional
}