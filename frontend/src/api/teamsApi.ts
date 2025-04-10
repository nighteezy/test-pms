import apiClient from "./apiClient";
import { GetTeamsResponse, GetTeamResponse } from "../types";

export const fetchTeams = async (): Promise<GetTeamsResponse[]> => {
  const response = await apiClient.get<GetTeamsResponse[]>("/teams");
  return response.data;
};

export const fetchTeamById = async (
  teamId: number
): Promise<GetTeamResponse> => {
  const response = await apiClient.get<GetTeamResponse>(`/teams/${teamId}`);
  return response.data;
};
