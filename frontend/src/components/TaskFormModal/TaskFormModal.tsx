// src/components/TaskFormModal.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // Можно заменить `any` на конкретный тип
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    assigneeId: '',
  });

  // Обработчик для текстовых полей
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик для выпадающего списка
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData); // Передаем данные в родительский компонент
    onClose(); // Закрываем модальное окно
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Создание задачи</DialogTitle>
      <DialogContent>
        {/* Поле "Название задачи" */}
        <TextField
          autoFocus
          margin="dense"
          label="Название задачи"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
          variant="standard"
          required
        />

        {/* Поле "Описание задачи" */}
        <TextField
          margin="dense"
          label="Описание задачи"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          variant="standard"
        />

        {/* Выбор приоритета */}
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleSelectChange} // Используем отдельный обработчик
          fullWidth
          variant="standard"
          sx={{ marginTop: '10px' }}
        >
          <MenuItem value="Low">Низкий</MenuItem>
          <MenuItem value="Medium">Средний</MenuItem>
          <MenuItem value="High">Высокий</MenuItem>
        </Select>

        {/* Выбор исполнителя */}
        <Select
          name="assigneeId"
          value={formData.assigneeId}
          onChange={handleSelectChange} // Используем отдельный обработчик
          fullWidth
          variant="standard"
          sx={{ marginTop: '10px' }}
        >
          <MenuItem value="">Не выбрано</MenuItem>
          <MenuItem value="1">Исполнитель 1</MenuItem>
          <MenuItem value="2">Исполнитель 2</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormModal;