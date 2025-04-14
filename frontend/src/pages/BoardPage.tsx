import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetTasksOnBoardResponse } from "../types";
import { fetchTasksOnBoard } from "../api/boardsApi";
import Column from "../components/Column/Column";
import { updateTaskStatus } from "../api/tasksApi";

interface BoardState {
  Backlog: GetTasksOnBoardResponse[];
  InProgress: GetTasksOnBoardResponse[];
  Done: GetTasksOnBoardResponse[];
}

const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<BoardState>({
    Backlog: [],
    InProgress: [],
    Done: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setEditingTask] = useState<GetTasksOnBoardResponse | null>(null);

  // Загрузка задач для доски
  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (id) {
          const tasksData = await fetchTasksOnBoard(Number(id));
          const groupedTasks: BoardState = {
            Backlog: tasksData.filter((task) => task.status === "Backlog"),
            InProgress: tasksData.filter(
              (task) => task.status === "InProgress"
            ),
            Done: tasksData.filter((task) => task.status === "Done"),
          };
          setTasks(groupedTasks);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Ошибка при загрузке задач";
        setError(errorMessage);
        console.error("Ошибка загрузки задач:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [id]);

  // Обработка перемещения задач внутри колонки
  const moveTaskWithinColumn = (
    status: keyof BoardState,
    dragIndex: number,
    hoverIndex: number
  ) => {
    setTasks((prevTasks) => {
      const newTasks = {
        ...prevTasks,
        [status]: [...prevTasks[status]],
      };

      if (
        dragIndex < 0 ||
        dragIndex >= newTasks[status].length ||
        hoverIndex < 0 ||
        hoverIndex > newTasks[status].length
      ) {
        return prevTasks;
      }

      const [movedTask] = newTasks[status].splice(dragIndex, 1);
      newTasks[status].splice(hoverIndex, 0, movedTask);

      return newTasks;
    });
  };

  // Обработка перемещения задач между колонками с обновлением на сервере
  const moveTaskBetweenColumns = async (
    sourceStatus: keyof BoardState,
    destinationStatus: keyof BoardState,
    dragIndex: number,
    hoverIndex: number
  ) => {
    if (sourceStatus === destinationStatus) {
      return;
    }

    try {
      // Находим перемещаемую задачу
      const taskToMove = tasks[sourceStatus][dragIndex];

      // Оптимистичное обновление UI
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const sourceTasks = [...newTasks[sourceStatus]];
        const destinationTasks = [...newTasks[destinationStatus]];

        const [movedTask] = sourceTasks.splice(dragIndex, 1);
        const updatedTask = {
          ...movedTask,
          status: destinationStatus,
        };

        destinationTasks.splice(hoverIndex, 0, updatedTask);

        return {
          ...newTasks,
          [sourceStatus]: sourceTasks,
          [destinationStatus]: destinationTasks,
        };
      });

      // Отправляем запрос на сервер для обновления статуса
      await updateTaskStatus(taskToMove.id, {
        status: destinationStatus,
        // Другие необходимые поля для обновления статуса
      });
    } catch (err) {
      // Откатываем изменения в случае ошибки
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ошибка при обновлении статуса задачи";
      setError(errorMessage);
      console.error("Ошибка обновления статуса:", err);

      // Перезагружаем задачи с сервера для синхронизации
      if (id) {
        const tasksData = await fetchTasksOnBoard(Number(id));
        const groupedTasks: BoardState = {
          Backlog: tasksData.filter((task) => task.status === "Backlog"),
          InProgress: tasksData.filter((task) => task.status === "InProgress"),
          Done: tasksData.filter((task) => task.status === "Done"),
        };
        setTasks(groupedTasks);
      }
    }
  };

  const handleEditTask = (task: GetTasksOnBoardResponse) => {
    setEditingTask(task);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h1>Проекты</h1>
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => setEditingTask({} as GetTasksOnBoardResponse)}
          style={{ marginRight: "8px" }}
        >
          Создать задачу
        </button>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <Column
          title="Backlog"
          tasks={tasks.Backlog}
          status="Backlog"
          onMoveTaskWithinColumn={(fromIndex, toIndex) =>
            moveTaskWithinColumn("Backlog", fromIndex, toIndex)
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
        <Column
          title="In Progress"
          tasks={tasks.InProgress}
          status="InProgress"
          onMoveTaskWithinColumn={(fromIndex, toIndex) =>
            moveTaskWithinColumn("InProgress", fromIndex, toIndex)
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
        <Column
          title="Done"
          tasks={tasks.Done}
          status="Done"
          onMoveTaskWithinColumn={(fromIndex, toIndex) =>
            moveTaskWithinColumn("Done", fromIndex, toIndex)
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
      </div>
    </div>
  );
};

export default BoardPage;
