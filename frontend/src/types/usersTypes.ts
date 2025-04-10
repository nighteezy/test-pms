
export interface GetUsersResponse {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  description: string;
  tasksCount: number; // Количество задач пользователя
  teamId: number;     // ID команды
  teamName: string;    // Название команды
}