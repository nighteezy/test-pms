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

  const [, drop] = useDrop({
    accept: 'TASK',
    drop(item: { id: number; index: number; status: string }, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const sourceStatus = item.status as keyof BoardState;
      const destinationStatus = status;

      // Вызываем функцию для перемещения задачи между колонками
      onMoveTaskBetweenColumns(sourceStatus, destinationStatus, item.index, 0);
    },
  });

  drop(ref);

  return (
    <div ref={ref} style={{ border: '1px solid #ccc', padding: '8px', width: '300px' }}>
      <h3>{title}</h3>
      <div>
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id} // Уникальный ключ
            task={task}
            index={index}
            moveTaskWithinColumn={onMoveTaskWithinColumn}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;