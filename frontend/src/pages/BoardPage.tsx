import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateTaskStatus, updateTask, getTaskById } from '../api/tasksApi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Box, Typography, Paper, List } from '@mui/material';
import { fetchTasksOnBoard } from '../api/boardsApi';

import {
  BoardState,
  GetTasksResponse,
  UpdateTaskRequest,
  CreateTaskRequest
} from '../types';
import TaskFormModal from '../components/TaskFormModal/TaskFormModal';
import { SortableTaskItem } from '../components/SortableTaskItem/SortableTaskItem';

const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<BoardState>({
    Backlog: [],
    InProgress: [],
    Done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<GetTasksResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (!id) {
          setError('ID доски не найден');
          return;
        }

        const boardId = Number(id);
        const tasksData = await fetchTasksOnBoard(boardId);

        // Преобразуем задачи к полному типу GetTasksResponse
        const transformedTasks: GetTasksResponse[] = tasksData.map(task => ({
          ...task,
          boardId,
          boardName: `Доска ${boardId}`
        }));

        const groupedTasks: BoardState = {
          Backlog: transformedTasks.filter((task) => task.status === 'Backlog'),
          InProgress: transformedTasks.filter((task) => task.status === 'InProgress'),
          Done: transformedTasks.filter((task) => task.status === 'Done'),
        };

        setTasks(groupedTasks);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка при загрузке задач';
        setError(errorMessage);
        console.error('Ошибка загрузки задач:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [id]);

  const handleTaskClick = async (task: GetTasksResponse) => {
    try {
      // Загружаем полные данные задачи
      const taskData = await getTaskById(task.id);
      setSelectedTask({
        ...taskData,
        boardId: task.boardId,
        boardName: task.boardName
      });
      setModalOpen(true);
    } catch (err) {
      console.error('Ошибка при загрузке данных задачи:', err);
    }
  };

  const handleSaveTask = async (data: UpdateTaskRequest | CreateTaskRequest) => {
    try {
      if (!selectedTask) return;

      // В режиме редактирования используем UpdateTaskRequest
      const updateData: UpdateTaskRequest = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: (data as UpdateTaskRequest).status || selectedTask.status,
        assigneeId: data.assigneeId
      };

      await updateTask(selectedTask.id, updateData);

      // Обновляем локальное состояние
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        Object.keys(newTasks).forEach(status => {
          newTasks[status as keyof BoardState] = newTasks[status as keyof BoardState].map(task => {
            if (task.id === selectedTask.id) {
              return { 
                ...task, 
                title: updateData.title,
                description: updateData.description,
                priority: updateData.priority,
                status: updateData.status,
                assignee: {
                  ...task.assignee,
                  id: updateData.assigneeId
                }
              };
            }
            return task;
          });
        });
        return newTasks;
      });

      setModalOpen(false);
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeContainer = Object.keys(tasks).find((key) =>
      tasks[key as keyof BoardState].some((task) => task.id === active.id)
    ) as keyof BoardState | undefined;

    const overContainer = Object.keys(tasks).find((key) =>
      tasks[key as keyof BoardState].some((task) => task.id === over.id)
    ) as keyof BoardState | undefined;

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = tasks[activeContainer].findIndex(
        (task) => task.id === active.id
      );
      const overIndex = tasks[overContainer].findIndex(
        (task) => task.id === over.id
      );

      setTasks((prevTasks) => ({
        ...prevTasks,
        [activeContainer]: arrayMove(
          prevTasks[activeContainer],
          activeIndex,
          overIndex
        ),
      }));
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeContainer = Object.keys(tasks).find((key) =>
      tasks[key as keyof BoardState].some((task) => task.id === active.id)
    ) as keyof BoardState | undefined;

    const overContainer = Object.keys(tasks).find((key) =>
      tasks[key as keyof BoardState].some((task) => task.id === over.id)
    ) as keyof BoardState | undefined;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const activeIndex = tasks[activeContainer].findIndex(
      (task) => task.id === active.id
    );
    const activeTask = tasks[activeContainer][activeIndex];

    try {
      await updateTaskStatus(activeTask.id, { status: overContainer });

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        newTasks[activeContainer] = newTasks[activeContainer].filter(
          (task) => task.id !== active.id
        );
        newTasks[overContainer] = [
          ...newTasks[overContainer],
          { 
            ...activeTask, 
            status: overContainer 
          } as GetTasksResponse,
        ];
        return newTasks;
      });
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ padding: '24px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Доска #{id}
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <Box display="flex" gap={3}>
          {Object.keys(tasks).map((status) => (
            <SortableContext
              key={status}
              items={tasks[status as keyof BoardState].map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <Paper
                sx={{
                  width: '30%',
                  padding: '16px',
                  minHeight: '200px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {status}
                </Typography>
                <List>
                  {tasks[status as keyof BoardState].map((task) => (
                    <SortableTaskItem 
                      key={task.id} 
                      id={task.id} 
                      task={task}
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                </List>
              </Paper>
            </SortableContext>
          ))}
        </Box>
      </DndContext>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode="edit"
      />
    </Box>
  );
};

export default BoardPage;