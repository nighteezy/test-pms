import React, { useState } from "react";
import {
  CreateTaskRequest,
  GetTasksResponse,
  UpdateTaskRequest,
} from "../types";

const IssuesPage: React.FC = () => {
  const [tasks, setTasks] = useState<GetTasksResponse[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<UpdateTaskRequest | null>(
    null
  );

  // Фильтрация и поиск
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus && task.status !== filterStatus) return false;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Добавление новой задачи
  const addTask = (newTask: CreateTaskRequest) => {
    const taskWithId: GetTasksResponse = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: "Backlog",
      assignee: { id: newTask.assigneeId, name: "Исполнитель" },
      boardName: "Доска 1",
      boardId: newTask.boardId,
    };
    setTasks((prevTasks) => [...prevTasks, taskWithId]);
  };

  // Обновление задачи
  const updateTask = (updatedTask: UpdateTaskRequest) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,
              title: updatedTask.title,
              description: updatedTask.description,
              priority: updatedTask.priority,
              status: updatedTask.status,
              assignee: { id: updatedTask.assigneeId, name: "Исполнитель" },
            }
          : task
      )
    );
  };

  return (
    <div>
      <h1>Все задачи</h1>

      {/* Кнопка создания задачи */}
      <button onClick={() => setIsModalOpen(true)}>Создать задачу</button>

      {/* Поиск и фильтры */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "16px 0",
        }}
      >
        <input
          type="text"
          placeholder="Поиск по названию"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={filterStatus || ""}
          onChange={(e) => setFilterStatus(e.target.value || null)}
        >
          <option value="">Все статусы</option>
          <option value="Backlog">Backlog</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Список задач */}
      <TaskList
        tasks={filteredTasks}
        onEditTask={(task) => setEditingTask(task)}
      />

      {/* Модальное окно для создания/редактирования задачи */}
      <TaskFormModal
        open={isModalOpen || !!editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={(data) => {
          if ("id" in data) {
            updateTask(data);
          } else {
            addTask(data as CreateTaskRequest);
          }
        }}
        mode={editingTask ? "edit" : "create"}
        defaultBoardId={1} // Пример ID доски для создания задачи
        isBoardLocked={false}
        task={editingTask || undefined}
      />
    </div>
  );
};

export default IssuesPage;
