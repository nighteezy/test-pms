import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import TaskItem from '../TaskItem/TaskItem';
import { GetTasksOnBoardResponse, BoardState } from '../../types';

interface ColumnProps {
  title: string;
  tasks: GetTasksOnBoardResponse[];
  status: 'Backlog' | 'InProgress' | 'Done';
  onMoveTaskWithinColumn: (fromIndex: number, toIndex: number) => void;
  onMoveTaskBetweenColumns: (
    sourceStatus: keyof BoardState,
    destinationStatus: keyof BoardState,
    dragIndex: number,
    hoverIndex: number
  ) => void;
  onEditTask: (task: GetTasksOnBoardResponse) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  status,
  onMoveTaskWithinColumn,
  onMoveTaskBetweenColumns,
  onEditTask,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: number; index: number; status: keyof BoardState }) => {
      const sourceStatus = item.status;
      const destinationStatus = status;
      const dragIndex = item.index;
      const hoverIndex = tasks.length; // Добавляем в конец колонки

      onMoveTaskBetweenColumns(sourceStatus, destinationStatus, dragIndex, hoverIndex);
    },
    canDrop: (item) => item.status !== status,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const columnStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    width: '300px',
    minHeight: '200px',
    backgroundColor: isOver ? '#f0f0f0' : 'white',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div ref={ref} style={columnStyle}>
      <h3>{title}</h3>
      <div style={{ minHeight: '50px' }}>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              status={status}
              moveTaskWithinColumn={onMoveTaskWithinColumn}
              onEditTask={onEditTask}
            />
          ))
        ) : (
          <div style={{
            padding: '16px',
            textAlign: 'center',
            color: '#999',
            border: '2px dashed #ddd',
            borderRadius: '4px',
            margin: '8px 0'
          }}>
            Перетащите задачи сюда
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;