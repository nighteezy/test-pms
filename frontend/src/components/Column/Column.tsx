import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import TaskItem from '../TaskItem/TaskItem';
import { BoardState, GetTasksOnBoardResponse } from '../../types';

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
    drop: (item: { id: number; index: number; status: string }, monitor) => {
      if (!monitor.didDrop()) {
        const sourceStatus = item.status as keyof BoardState;
        const dragIndex = item.index;
        const hoverIndex = tasks.length;
        onMoveTaskBetweenColumns(sourceStatus, status, dragIndex, hoverIndex);
      }
    },
    hover: (item: { id: number; index: number; status: string }) => {
      if (!ref.current || item.status === status) return;
      const hoverIndex = tasks.length;
      if (item.index === hoverIndex) return;
      onMoveTaskBetweenColumns(item.status as keyof BoardState, status, item.index, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div 
      ref={ref}
      style={{
        border: '1px solid #ccc',
        padding: '16px',
        width: '300px',
        minHeight: '400px',
        backgroundColor: isOver ? '#f5f5f5' : 'white',
        borderRadius: '4px',
      }}
    >
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <div style={{ marginTop: '16px' }}>
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            status={status}
            onEditTask={onEditTask}
            moveTaskWithinColumn={onMoveTaskWithinColumn}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;