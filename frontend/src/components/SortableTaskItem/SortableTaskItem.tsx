import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListItem, ListItemText } from '@mui/material';
import { GetTasksResponse } from '../../types';


interface SortableTaskItemProps {
  id: number;
  task: GetTasksResponse;
  onClick: () => void;
}

export const SortableTaskItem: React.FC<SortableTaskItemProps> = ({ 
  id, 
  task, 
  onClick 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        backgroundColor: 'white',
        marginBottom: '8px',
        borderRadius: '4px',
        boxShadow: 1,
      }}
      onClick={handleClick}
    >
      <ListItemText 
        primary={task.title} 
        secondary={
          <>
            <div>{task.description}</div>
            <div>Приоритет: {task.priority}</div>
            <div>Исполнитель: {task.assignee.fullName}</div>
            <div>Доска: {task.boardName}</div>
          </>
        } 
      />
    </ListItem>
  );
};