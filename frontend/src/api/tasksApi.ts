import apiClient from "./apiClient";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  GetTasksResponse,
  GetUserTasksResponse,
  GetTaskByIDResponse,
  UpdateTaskResponse,
  UpdateTaskStatusResponse,
} from "../types";

export const fetchIssues = async (): Promise<GetTasksResponse[]> => {
  try {
    const response = await apiClient.get<{ data: GetTasksResponse[] }>("/tasks");
    return response.data.data; // Возвращаем массив задач из поля `data`
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error);
    throw new Error('Не удалось загрузить задачи');
  }
};

export const createIssue = async (
  taskData: CreateTaskRequest
): Promise<GetTasksResponse> => {
  const response = await apiClient.post<GetTasksResponse>(
    "/tasks/create",
    taskData
  );
  return response.data;
};

export const updateTask = async (
  taskId: number,
  taskData: UpdateTaskRequest
): Promise<UpdateTaskResponse> => {
  const response = await apiClient.put(`/tasks/update/${taskId}`, taskData);
  return response.data;
};

export const updateTaskStatus = async (
  taskId: number,
  statusData: UpdateTaskStatusRequest
): Promise<UpdateTaskStatusResponse> => {
  const response = await apiClient.put(
    `/tasks/updateStatus/${taskId}`,
    statusData
  );
  return response.data;
};

export const getTaskById = async (
  taskId: number
): Promise<GetTaskByIDResponse> => {
  const response = await apiClient.get<GetTaskByIDResponse>(`/tasks/${taskId}`);
  return response.data;
};

export const getUserTasks = async (
  userId: number
): Promise<GetUserTasksResponse[]> => {
  const response = await apiClient.get<GetUserTasksResponse[]>(
    `/users/${userId}/tasks`
  );
  return response.data;
};
