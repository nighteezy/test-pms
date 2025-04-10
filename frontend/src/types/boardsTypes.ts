import { AssigneeUserForTask } from "./commonTypes";

export interface BoardBase {
  id: number;
  name: string;
  description: string;
}

export interface GetBoardsResponse extends BoardBase {
  taskCount: number; // Количество задач на доске
}

export interface GetTasksOnBoardResponse {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Backlog" | "InProgress" | "Done";
  assignee: AssigneeUserForTask;
}
