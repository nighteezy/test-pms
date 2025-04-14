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

  // Сохранение состояния в localStorage
  const saveBoardState = (boardState: BoardState) => {
    if (id) {
      localStorage.setItem(`board-${id}`, JSON.stringify(boardState));
    }
  };

  // Загрузка задач для доски
  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (id) {
          // Пытаемся загрузить из localStorage
          const savedState = localStorage.getItem(`board-${id}`);
          
          if (savedState) {
            setTasks(JSON.parse(savedState));
            setLoading(false);
            return;
          }

          // Если в localStorage нет, загружаем с сервера
          const tasksData = await fetchTasksOnBoard(Number(id));
          const groupedTasks: BoardState = {
            Backlog: tasksData.filter(task => task.status === 'Backlog'),
            InProgress: tasksData.filter(task => task.status === 'InProgress'),
            Done: tasksData.filter(task => task.status === 'Done'),
          };

          setTasks(groupedTasks);
          saveBoardState(groupedTasks);
        }
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
      const newTasks = {
        ...prevTasks,
        [status]: [...prevTasks[status]]
      };
      
      // Проверка валидности индексов
      if (dragIndex < 0 || dragIndex >= newTasks[status].length || 
          hoverIndex < 0 || hoverIndex > newTasks[status].length) {
        return prevTasks;
      }

      const [movedTask] = newTasks[status].splice(dragIndex, 1);
      newTasks[status].splice(hoverIndex, 0, movedTask);
      
      saveBoardState(newTasks);
      return newTasks;
    });
  };

  // Обработка перемещения задач между колонками
  const moveTaskBetweenColumns = (
    sourceStatus: keyof BoardState,
    destinationStatus: keyof BoardState,
    dragIndex: number,
    hoverIndex: number
  ) => {
    setTasks((prevTasks) => {
      if (sourceStatus === destinationStatus) {
        return prevTasks;
      }

      const newTasks = { ...prevTasks };
      const sourceTasks = [...newTasks[sourceStatus]];
      const destinationTasks = [...newTasks[destinationStatus]];

      // Проверка валидности индексов
      if (dragIndex < 0 || dragIndex >= sourceTasks.length || 
          hoverIndex < 0 || hoverIndex > destinationTasks.length) {
        return prevTasks;
      }

      const [movedTask] = sourceTasks.splice(dragIndex, 1);
      const updatedTask = {
        ...movedTask,
        status: destinationStatus
      };

      destinationTasks.splice(hoverIndex, 0, updatedTask);

      const updatedState = {
        ...newTasks,
        [sourceStatus]: sourceTasks,
        [destinationStatus]: destinationTasks
      };

      saveBoardState(updatedState);
      return updatedState;
    });
  };

  // Сброс доски к первоначальному состоянию
  const resetBoard = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      localStorage.removeItem(`board-${id}`);
      const tasksData = await fetchTasksOnBoard(Number(id));
      
      const groupedTasks: BoardState = {
        Backlog: tasksData.filter(task => task.status === 'Backlog'),
        InProgress: tasksData.filter(task => task.status === 'InProgress'),
        Done: tasksData.filter(task => task.status === 'Done'),
      };

      setTasks(groupedTasks);
    } catch (error) {
      setError('Ошибка при сбросе доски');
    } finally {
      setLoading(false);
    }
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
      <div style={{ marginBottom: '16px' }}>
        <button 
          onClick={() => setEditingTask({} as GetTasksOnBoardResponse)}
          style={{ marginRight: '8px' }}
        >
          Создать задачу
        </button>
        <button onClick={resetBoard} style={{ backgroundColor: '#ffcccc' }}>
          Сбросить доску
        </button>
      </div>

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
    </div>
  );
};

export default BoardPage;