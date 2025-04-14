import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GetTasksOnBoardResponse } from '../../types';


interface TaskItemProps {
  task: GetTasksOnBoardResponse;
  index: number;
  status: 'Backlog' | 'InProgress' | 'Done';
  moveTaskWithinColumn: (fromIndex: number, toIndex: number) => void;
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
    item: { id: task.id, index, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { id: number; index: number }, monitor) => {
      if (!ref.current || item.id === task.id) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTaskWithinColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTask(task);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '12px',
        marginBottom: '8px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'move',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <h4 style={{ margin: '0 0 8px 0' }}>{task.title}</h4>
      <p style={{ margin: '0 0 8px 0', color: '#666' }}>{task.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ 
          color: task.priority === 'High' ? '#d32f2f' : 
                task.priority === 'Medium' ? '#ed6c02' : '#2e7d32'
        }}>
          {task.priority === 'High' ? 'Высокий' : 
           task.priority === 'Medium' ? 'Средний' : 'Низкий'}
        </span>
        {task.assignee && (
          <span style={{ color: '#1976d2' }}>
            {task.assignee.fullName || `Исполнитель #${task.assignee.id}`}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;