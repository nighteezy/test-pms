import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { GetTasksResponse, UpdateTaskRequest, CreateTaskRequest } from '../../types';

// Объединенный тип для состояния формы
type TaskFormData = CreateTaskRequest & Partial<UpdateTaskRequest>;

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateTaskRequest | UpdateTaskRequest) => void;
  task?: GetTasksResponse | null; // Предзаполненные данные для редактирования
  mode: 'create' | 'edit'; // Режим: создание или редактирование
  boardLink?: string; // Ссылка на доску (если вызвано со страницы всех задач)
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onClose,
  onSave,
  task,
  mode,
  boardLink,
}) => {
  // Инициализация состояния формы с предзаполненными данными
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'Low',
    status: undefined,
    assigneeId: 1,
    boardId: 1,
  });

  // Обновление состояния formData при изменении task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Low',
        status: task.status || undefined,
        assigneeId: task.assignee.id || 1,
        boardId: task.boardId || 1,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Low',
        status: undefined,
        assigneeId: 1,
        boardId: 1,
      });
    }
  }, [task]);

  // Обновление полей формы
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Обработка сохранения
  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Создание задачи' : 'Редактирование задачи'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Название"
          fullWidth
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Описание"
          fullWidth
          multiline
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Select
          margin="dense"
          fullWidth
          name="priority"
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })
          }
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
        {mode === 'edit' && (
          <Select
            margin="dense"
            fullWidth
            name="status"
            value={formData.status || 'Backlog'}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'Backlog' | 'InProgress' | 'Done',
              })
            }
          >
            <MenuItem value="Backlog">Backlog</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        )}
        <TextField
          margin="dense"
          label="ID исполнителя"
          type="number"
          fullWidth
          name="assigneeId"
          value={formData.assigneeId}
          onChange={(e) =>
            setFormData({ ...formData, assigneeId: Number(e.target.value) })
          }
        />
        {mode === 'edit' && boardLink && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
            onClick={() => window.location.href = boardLink}
          >
            Перейти на доску
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Отмена
        </Button>
        <Button onClick={handleSave} color="primary">
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormModal;