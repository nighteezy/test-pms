// src/components/TaskFormModal.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { z } from "zod";
import { CreateTaskRequest, UpdateTaskRequest } from "../../types";

type TaskFormData = CreateTaskRequest | UpdateTaskRequest;

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  mode: "create" | "edit"; // Режим: создание или редактирование
  defaultBoardId?: number; // ID доски для режима создания
  isBoardLocked?: boolean; // Флаг, указывающий, заблокировано ли поле выбора доски
  task?: UpdateTaskRequest; // Данные задачи для режима редактирования
}

// Схема валидации с помощью Zod
const createTaskSchema = z.object({
  title: z.string().min(1, "Название задачи обязательно"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Backlog", "InProgress", "Done"]), // Обязательное поле
  assigneeId: z.number().min(0, "Выберите исполнителя"),
  boardId: z.number().min(1, "Выберите доску"), // Обязательное поле
});

const updateTaskSchema = createTaskSchema.partial({ boardId: true });

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  mode,
  defaultBoardId,
  isBoardLocked = false,
  task,
}) => {
  // Инициализация состояния
  const [formData, setFormData] = useState<TaskFormData>(
    mode === "edit" && task
      ? task
      : {
          title: "",
          description: "",
          priority: "Low",
          status: "Backlog",
          boardId: defaultBoardId || 0,
          assigneeId: 0,
        }
  );

  // Флаги для режимов
  const isCreateMode = mode === "create";

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

  // Обработчик для выпадающих списков
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    try {
      if (isCreateMode) {
        createTaskSchema.parse(formData); // Валидация для создания
      } else {
        updateTaskSchema.parse(formData); // Валидация для редактирования
      }

      onSubmit(formData);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors.map((err) => err.message).join("\n"));
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Заголовок зависит от режима */}
      <DialogTitle>
        {isCreateMode ? "Создание задачи" : "Редактирование задачи"}
      </DialogTitle>
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
          onChange={handleSelectChange}
          fullWidth
          variant="standard"
          sx={{ marginTop: "10px" }}
        >
          <MenuItem value="Low">Низкий</MenuItem>
          <MenuItem value="Medium">Средний</MenuItem>
          <MenuItem value="High">Высокий</MenuItem>
        </Select>

        {/* Выбор статуса */}
        <Select
          name="status"
          value={formData.status}
          onChange={handleSelectChange}
          fullWidth
          variant="standard"
          sx={{ marginTop: "10px" }}
        >
          <MenuItem value="Backlog">Backlog</MenuItem>
          <MenuItem value="InProgress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>

        {/* Выбор исполнителя */}
        <Select
          name="assigneeId"
          value={formData.assigneeId}
          onChange={(e: SelectChangeEvent<number>) =>
            setFormData((prevData) => ({
              ...prevData,
              assigneeId: Number(e.target.value),
            }))
          }
          fullWidth
          variant="standard"
          sx={{ marginTop: "10px" }}
        >
          <MenuItem value={0}>Не выбрано</MenuItem>
          <MenuItem value={1}>Исполнитель 1</MenuItem>
          <MenuItem value={2}>Исполнитель 2</MenuItem>
        </Select>

        {/* Выбор доски (только для режима создания) */}
        {isCreateMode && (
          <Select
            name="boardId"
            value={formData.boardId}
            onChange={(e: SelectChangeEvent<number>) =>
              setFormData((prevData) => ({
                ...prevData,
                boardId: Number(e.target.value),
              }))
            }
            fullWidth
            variant="standard"
            disabled={isBoardLocked}
            sx={{ marginTop: "10px" }}
          >
            <MenuItem value={0}>Не выбрано</MenuItem>
            <MenuItem value={1}>Доска 1</MenuItem>
            <MenuItem value={2}>Доска 2</MenuItem>
          </Select>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isCreateMode ? "Создать" : "Сохранить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormModal;
