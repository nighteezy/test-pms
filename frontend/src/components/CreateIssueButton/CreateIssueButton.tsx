import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { CreateTaskRequest } from '../../types';

interface CreateIssueButtonProps {
  onCreate: (newIssue: CreateTaskRequest) => void;
}

const CreateIssueButton: React.FC<CreateIssueButtonProps> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [newIssue, setNewIssue] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    priority: 'Low',
    boardId: 1,
    assigneeId: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const handleCreate = () => {
    onCreate(newIssue);
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Создать задачу
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Создать новую задачу</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Название"
            fullWidth
            value={newIssue.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Описание"
            fullWidth
            multiline
            rows={4}
            value={newIssue.description}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Приоритет</InputLabel>
            <Select
              name="priority"
              value={newIssue.priority}
              onChange={(e) =>
                setNewIssue({ ...newIssue, priority: e.target.value as 'Low' | 'Medium' | 'High' })
              }
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="boardId"
            label="ID доски"
            type="number"
            fullWidth
            value={newIssue.boardId}
            onChange={(e) =>
              setNewIssue({ ...newIssue, boardId: Number(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            name="assigneeId"
            label="ID исполнителя"
            type="number"
            fullWidth
            value={newIssue.assigneeId}
            onChange={(e) =>
              setNewIssue({ ...newIssue, assigneeId: Number(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleCreate} color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateIssueButton;