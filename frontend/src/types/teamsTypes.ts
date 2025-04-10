export interface GetTeamsResponse {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  boardsCount: number;
}

export interface GetTeamBoards {
  id: number;
  name: string;
  description: string;
}

export interface GetTeamUsers {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  description: string;
}

export interface GetTeamResponse {
  id: number;
  name: string;
  description: string;
  boards: GetTeamBoards[];
  users: GetTeamUsers[];
}
