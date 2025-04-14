import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetTasksOnBoardResponse, UpdateTaskRequest, CreateTaskRequest, UpdateTaskStatusRequest } from '../types';
import Column from '../components/Column/Column';
import TaskFormModal from '../components/TaskFormModal/TaskFormModal';
import { fetchTasksOnBoard } from '../api/boardsApi';
import { createIssue, updateTask, updateTaskStatus } from '../api/tasksApi';

interface BoardState {
  Backlog: GetTasksOnBoardResponse[];
  InProgress: GetTasksOnBoardResponse[];
  Done: GetTasksOnBoardResponse[];
}

const BoardPage: React.FC = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<BoardState>({
    Backlog: [],
    InProgress: [],
    Done: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<GetTasksOnBoardResponse | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (boardId) {
          const tasksData = await fetchTasksOnBoard(Number(boardId));
          const groupedTasks: BoardState = {
            Backlog: tasksData.filter(task => task.status === 'Backlog'),
            InProgress: tasksData.filter(task => task.status === 'InProgress'),
            Done: tasksData.filter(task => task.status === 'Done'),
          };
          setTasks(groupedTasks);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке задач');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [boardId]);

  const handleEditTask = (task: GetTasksOnBoardResponse) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    try {
      setLoading(true);
      
      if (currentTask) {
        // Редактирование
        const updateData: UpdateTaskRequest = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: (data as UpdateTaskRequest).status || currentTask.status,
          assigneeId: data.assigneeId
        };

        await updateTask(currentTask.id, updateData);
        
        setTasks(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(key => {
            newState[key as keyof BoardState] = newState[key as keyof BoardState]
              .filter(t => t.id !== currentTask.id);
          });
          
          newState[updateData.status] = [
            ...newState[updateData.status],
            {
              ...currentTask,
              ...updateData,
              assignee: {
                ...currentTask.assignee,
                id: updateData.assigneeId
              }
            }
          ];
          
          return newState;
        });
      } else {
        // Создание
        const createData: CreateTaskRequest = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          boardId: Number(boardId),
          assigneeId: data.assigneeId
        };

        const newTask = await createIssue(createData);
        
        setTasks(prev => ({
          ...prev,
          [newTask.status]: [...prev[newTask.status as keyof BoardState], newTask]
        }));
      }
      
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении задачи');
    } finally {
      setLoading(false);
    }
  };

  const moveTaskWithinColumn = (fromIndex: number, toIndex: number, status: keyof BoardState) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      const columnTasks = [...newTasks[status]];
      const [movedTask] = columnTasks.splice(fromIndex, 1);
      columnTasks.splice(toIndex, 0, movedTask);
      
      return {
        ...newTasks,
        [status]: columnTasks
      };
    });
  };

  const moveTaskBetweenColumns = async (
    sourceStatus: keyof BoardState,
    destinationStatus: keyof BoardState,
    dragIndex: number,
    hoverIndex: number
  ) => {
    if (sourceStatus === destinationStatus) return;

    const taskToMove = tasks[sourceStatus][dragIndex];
    const updateData: UpdateTaskStatusRequest = { status: destinationStatus };
    
    try {
      // Оптимистичное обновление
      setTasks(prev => {
        const newTasks = { ...prev };
        const sourceTasks = [...newTasks[sourceStatus]];
        const destinationTasks = [...newTasks[destinationStatus]];

        const [movedTask] = sourceTasks.splice(dragIndex, 1);
        destinationTasks.splice(hoverIndex, 0, {
          ...movedTask,
          status: destinationStatus
        });

        return {
          ...newTasks,
          [sourceStatus]: sourceTasks,
          [destinationStatus]: destinationTasks
        };
      });

      await updateTaskStatus(taskToMove.id, updateData);
    } catch (err) {
      // Откат при ошибке
      setTasks(prev => prev);
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении статуса');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Проекты</h1>
      <button 
        onClick={() => {
          setCurrentTask(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: '16px' }}
      >
        Создать задачу
      </button>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Column
          title="Backlog"
          tasks={tasks.Backlog}
          status="Backlog"
          onMoveTaskWithinColumn={(fromIndex, toIndex) => 
            moveTaskWithinColumn(fromIndex, toIndex, 'Backlog')
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
        <Column
          title="In Progress"
          tasks={tasks.InProgress}
          status="InProgress"
          onMoveTaskWithinColumn={(fromIndex, toIndex) => 
            moveTaskWithinColumn(fromIndex, toIndex, 'InProgress')
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
        <Column
          title="Done"
          tasks={tasks.Done}
          status="Done"
          onMoveTaskWithinColumn={(fromIndex, toIndex) => 
            moveTaskWithinColumn(fromIndex, toIndex, 'Done')
          }
          onMoveTaskBetweenColumns={moveTaskBetweenColumns}
          onEditTask={handleEditTask}
        />
      </div>

      <TaskFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={currentTask || null}
        mode={currentTask ? 'edit' : 'create'}
      />
    </div>
  );
};

export default BoardPage;