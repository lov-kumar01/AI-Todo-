import axiosClient from "./axiosClient";
import {
  createTodoSchema,
  updateTodoSchema,
  todoSchema,
  todoListSchema,
  CreateTodoInput,
  UpdateTodoInput
} from "../schemas/todoSchemas";

// Get todos
export const fetchTodos = async () => {
  const res = await axiosClient.get("/todos");
  return todoListSchema.parse(res.data);
};

// Create todo
export const createTodoRequest = async (data: CreateTodoInput) => {
  const res = await axiosClient.post("/todos", data);
  return todoSchema.parse(res.data);
};

// Update todo
export const updateTodoRequest = async (id: string, data: UpdateTodoInput) => {
  const res = await axiosClient.put(`/todos/${id}`, data);
  return todoSchema.parse(res.data);
};

// Delete todo
export const deleteTodoRequest = async (id: string) => {
  const res = await axiosClient.delete(`/todos/${id}`);
  return res.data as { message: string };
};

// Toggle completion state
export const toggleTodoRequest = async (id: string) => {
  const res = await axiosClient.patch(`/todos/${id}/toggle`);
  return todoSchema.parse(res.data);
};
