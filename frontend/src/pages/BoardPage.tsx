import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetTasksOnBoardResponse } from '../types';
import { fetchTasksOnBoard } from '../api/boardsApi';
import Column from '../components/Column/Column';


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
            Backlog: [],
            InProgress: [],
            Done: [],
          };

          tasksData.forEach((task) => {
            switch (task.status) {
              case 'Backlog':
                groupedTasks.Backlog.push(task);
                break;
              case 'InProgress':
                groupedTasks.InProgress.push(task);
                break;
              case 'Done':
                groupedTasks.Done.push(task);
                break;
              default:
                console.error(`Unknown task status: ${task.status}`);
            }
          });

          setTasks(groupedTasks);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Ошибка при загрузке задач');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [id]);

  // Обработка перемещения задач внутри колонки
  const moveTaskWithinColumn = (status: keyof BoardState, dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const sourceTasks = [...prevTasks[status]];
  
      // Проверяем, что индексы находятся в допустимых пределах
      if (dragIndex < 0 || dragIndex >= sourceTasks.length || hoverIndex < 0 || hoverIndex > sourceTasks.length) {
        console.error(`Invalid drag or hover index: dragIndex=${dragIndex}, hoverIndex=${hoverIndex}`);
        return prevTasks;
      }
  
      // Удаляем задачу из исходной позиции
      const [movedTask] = sourceTasks.splice(dragIndex, 1);
  
      // Вставляем задачу в новую позицию
      sourceTasks.splice(hoverIndex, 0, movedTask);
  
      // Возвращаем обновленное состояние
      return {
        ...prevTasks,
        [status]: sourceTasks,
      };
    });
  };
  useEffect(() => {
    console.log('Current tasks state:', tasks);
  }, [tasks]);

  // Обработка перемещения задач между колонками
  const moveTaskBetweenColumns = (
    sourceStatus: keyof BoardState,
    destinationStatus: keyof BoardState,
    dragIndex: number,
    hoverIndex: number
  ) => {
    setTasks((prevTasks) => {
      // Если статусы совпадают, используем moveTaskWithinColumn вместо этого
      if (sourceStatus === destinationStatus) {
        return prevTasks;
      }
  
      // Создаем копии массивов задач
      const sourceTasks = [...prevTasks[sourceStatus]];
      const destinationTasks = [...prevTasks[destinationStatus]];
  
      // Проверяем индексы на валидность
      if (dragIndex < 0 || dragIndex >= sourceTasks.length) {
        console.error(`Invalid drag index: ${dragIndex}`);
        return prevTasks;
      }
  
      if (hoverIndex < 0 || hoverIndex > destinationTasks.length) {
        console.error(`Invalid hover index: ${hoverIndex}`);
        return prevTasks;
      }
  
      // Извлекаем задачу из исходной колонки
      const [movedTask] = sourceTasks.splice(dragIndex, 1);
      
      // Обновляем статус задачи
      const updatedTask = {
        ...movedTask,
        status: destinationStatus
      };
  
      // Вставляем задачу в целевую колонку
      destinationTasks.splice(hoverIndex, 0, updatedTask);
  
      // Возвращаем обновленное состояние
      return {
        ...prevTasks,
        [sourceStatus]: sourceTasks,
        [destinationStatus]: destinationTasks
      };
    });
  };

  // Сохранение черновика задачи
  // const saveDraft = (task: GetTasksOnBoardResponse) => {
  //   if (!task) {
  //     console.error('Cannot save draft: task is undefined');
  //     return;
  //   }
  //   localStorage.setItem(`draft-task-${task.id}`, JSON.stringify(task));
  // };

  // Открытие модального окна для редактирования задачи
  const handleEditTask = (task: GetTasksOnBoardResponse) => {
    setEditingTask(task);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Проекты</h1>
      <button onClick={() => setEditingTask({} as GetTasksOnBoardResponse)}>Создать задачу</button>

      {/* Список задач */}
      <div style={{ display: 'flex', gap: '16px' }}>
        <Column
          title="Backlog"
          tasks={tasks.Backlog}
          status="Backlog"
          onMoveTaskWithinColumn={(fromIndex, toIndex) =>
            moveTaskWithinColumn('Backlog', fromIndex, toIndex)
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
        <Column
          title="In Progress"
          tasks={tasks.InProgress}
          status="InProgress"
          onMoveTaskWithinColumn={(fromIndex, toIndex) =>
            moveTaskWithinColumn('InProgress', fromIndex, toIndex)
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
        <Column
          title="Done"
          tasks={tasks.Done}
          status="Done"
          onMoveTaskWithinColumn={(fromIndex, toIndex) =>
            moveTaskWithinColumn('Done', fromIndex, toIndex)
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
      </div>

      {/* Модальное окно для редактирования задачи 
      {editingTask && (
        <TaskModal
          task={editingTask}
          onSave={(updatedTask) => {
            setTasks((prevTasks) => {
              const statusKey = updatedTask.status as keyof BoardState;
              const updatedTasks = prevTasks[statusKey].map((t) =>
                t.id === updatedTask.id ? updatedTask : t
              );

              return {
                ...prevTasks,
                [statusKey]: updatedTasks,
              };
            });
            setEditingTask(null);
          }}
          onClose={() => setEditingTask(null)}
        />
      )}
        */}
    </div>
  );
};

export default BoardPage;