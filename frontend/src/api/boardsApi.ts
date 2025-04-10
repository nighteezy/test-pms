import apiClient from "./apiClient";
import { GetBoardsResponse, GetTasksOnBoardResponse } from "../types";

export const fetchBoards = async (): Promise<GetBoardsResponse[]> => {
  const response = await apiClient.get<GetBoardsResponse[]>("/boards");
  return response.data;
};

export const fetchTasksOnBoard = async (
  boardId: number
): Promise<GetTasksOnBoardResponse[]> => {
  const response = await apiClient.get<GetTasksOnBoardResponse[]>(
    `/boards/${boardId}`
  );
  return response.data;
};
