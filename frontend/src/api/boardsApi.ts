import apiClient from "./apiClient";
import { GetBoardsResponse, GetTasksOnBoardResponse } from "../types";
import { AxiosError } from "axios";

// Функция для получения досок
export const fetchBoards = async (): Promise<GetBoardsResponse[]> => {
  try {
    const response = await apiClient.get<{ data: GetBoardsResponse[] }>("/boards");
    return response.data.data; // Извлекаем массив досок из поля `data`
  } catch (error) {
    const axiosError = error as AxiosError; // Приводим ошибку к типу AxiosError
    if (axiosError.response) {
      console.error('Server error:', axiosError.response.status, axiosError.response.data);
    } else if (axiosError.request) {
      console.error('No response from server:', axiosError.request);
    } else {
      console.error('Error:', axiosError.message);
    }
    throw new Error('Не удалось загрузить доски');
  }
};

// Функция для получения задач на доске
export const fetchTasksOnBoard = async (
  boardId: number
): Promise<GetTasksOnBoardResponse[]> => {
  try {
    const response = await apiClient.get<{ data: GetTasksOnBoardResponse[] }>(
      `/boards/${boardId}`
    );
    return response.data.data; // Извлекаем массив задач из поля `data`
  } catch (error) {
    const axiosError = error as AxiosError; // Приводим ошибку к типу AxiosError
    if (axiosError.response) {
      console.error('Server error:', axiosError.response.status, axiosError.response.data);
    } else if (axiosError.request) {
      console.error('No response from server:', axiosError.request);
    } else {
      console.error('Error:', axiosError.message);
    }
    throw new Error('Не удалось загрузить задачи');
  }
};