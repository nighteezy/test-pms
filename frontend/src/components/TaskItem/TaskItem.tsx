import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GetTasksOnBoardResponse } from '../../types';

interface TaskItemProps {
  task: GetTasksOnBoardResponse;
  index: number;
  moveTaskWithinColumn: (dragIndex: number, hoverIndex: number) => void; // Добавлена функция
  onEditTask: (task: GetTasksOnBoardResponse) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, moveTaskWithinColumn, onEditTask }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, index, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover(item: { id: number; index: number; status: string }) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Если индексы совпадают, ничего не делаем
      if (dragIndex === hoverIndex) return;

      // Вызываем функцию для изменения порядка задач
      moveTaskWithinColumn(dragIndex, hoverIndex);

      // Обновляем индекс в объекте item
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={() => onEditTask(task)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '8px',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'move',
      }}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <small>{task.priority}</small>
    </div>
  );
};

export default TaskItem;