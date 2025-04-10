//типы, связанные с задачами

import { AssigneeUserForTask } from "./commonTypes";

export interface TaskBase {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Backlog" | "InProgress" | "Done";
  assignee: AssigneeUserForTask;
  boardName: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  boardId: number;
  assigneeId: number;
}

export interface CreateTaskResponse {
  id: number;
}

export type GetTaskByIDResponse = TaskBase;

export interface GetTasksResponse extends TaskBase {
  boardId: number;
}

export type GetUserTasksResponse = Omit<TaskBase, "boardName">;

export interface UpdateTaskRequest {
  title: string; // Длина от 1 до 100 символов
  description: string; // Длина от 1 до 500 символов
  priority: "Low" | "Medium" | "High"; // Перечисление приоритетов
  status: "Backlog" | "InProgress" | "Done"; // Статус задачи
  assigneeId: number; // ID исполнителя
}

export interface UpdateTaskResponse {
  message: string; // Сообщение об успехе или ошибке
}

export interface UpdateTaskStatusRequest {
  status: "Backlog" | "InProgress" | "Done"; // Новый статус задачи
}

export interface UpdateTaskStatusResponse {
  message: string; // Сообщение об успехе или ошибке
}
