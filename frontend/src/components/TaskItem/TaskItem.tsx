import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GetTasksOnBoardResponse } from '../../types';

interface TaskItemProps {
  task: GetTasksOnBoardResponse;
  index: number;
  status: 'Backlog' | 'InProgress' | 'Done'; // Добавляем пропс status
  moveTaskWithinColumn: (dragIndex: number, hoverIndex: number) => void;
  onEditTask: (task: GetTasksOnBoardResponse) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  status,
  moveTaskWithinColumn,
  onEditTask,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { 
      id: task.id, 
      index,
      status, // Используем переданный статус
      originalIndex: index, // Сохраняем оригинальный индекс
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // Если перемещение не удалось, возвращаем задачу на место
      if (!monitor.didDrop()) {
        moveTaskWithinColumn(item.index, item.originalIndex);
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover(item: { id: number; index: number; status: string }, monitor) {
      if (!ref.current) return;
      
      // Не выполняем действия, если задача наведена на саму себя
      if (item.id === task.id) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Если индексы совпадают, ничего не делаем
      if (dragIndex === hoverIndex) return;

      // Определяем позиции элементов
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Перемещаем только если мышь пересекла половину высоты элемента
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Вызываем функцию для изменения порядка задач
      moveTaskWithinColumn(dragIndex, hoverIndex);

      // Обновляем индекс в объекте item
      item.index = hoverIndex;
    },
    drop(item: { id: number; index: number; status: string }) {
      // Обрабатываем только если задача была перемещена из другой колонки
      if (item.status !== status) {
        // Здесь можно добавить дополнительную логику при успешном drop
      }
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
        backgroundColor: isDragging ? '#f8f8f8' : 'white',
        transition: 'background-color 0.2s ease',
      }}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      <small>Приоритет: {task.priority}</small>
      <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
        Статус: {status}
      </small>
    </div>
  );
};

export default TaskItem;