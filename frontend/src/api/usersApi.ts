import apiClient from "./apiClient";
import { GetUsersResponse } from "../types";

export const fetchUsers = async (): Promise<GetUsersResponse[]> => {
  const response = await apiClient.get<GetUsersResponse[]>("/users");
  return response.data;
};
