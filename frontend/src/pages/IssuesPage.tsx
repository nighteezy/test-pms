import React, { useState, useEffect } from 'react';
import {
  fetchIssues,
  createIssue,
  updateTask,
} from '../api/tasksApi';
import {
  CreateTaskRequest,
  GetTasksResponse,
  UpdateTaskRequest,
} from '../types';
import SearchBar from '../components/SearchBar/SearchBar';
import Filters from '../components/Filters/Filters';
import IssuesList from '../components/IssuesList/IssuesList';
import TaskFormModal from '../components/TaskFormModal/TaskFormModal';
import { Button, Typography, Box } from '@mui/material';

const IssuesPage: React.FC = () => {
  const [issues, setIssues] = useState<GetTasksResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<null | string>(null);
  const [boardFilter, setBoardFilter] = useState<null | string>(null);

  // Состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<GetTasksResponse | null>(null);

  // Загрузка задач при монтировании
  useEffect(() => {
    const loadIssues = async () => {
      try {
        const fetchedIssues = await fetchIssues();
        setIssues(fetchedIssues); // Устанавливаем массив задач
      } catch (err) {
        console.error('Ошибка при загрузке задач:', err);
        setIssues([]); // Устанавливаем пустой массив в случае ошибки
      }
    };
    loadIssues();
  }, []);

  // Создание новой задачи
  const handleCreateIssue = async (newIssue: CreateTaskRequest) => {
    const createdIssue = await createIssue(newIssue);
    setIssues([...issues, createdIssue]);
  };

  // Редактирование задачи
  const handleEditIssue = async (updatedIssue: UpdateTaskRequest) => {
    if (!selectedTask) return;

    await updateTask(selectedTask.id, updatedIssue);
    const updatedIssues = issues.map((issue) =>
      issue.id === selectedTask.id ? { ...issue, ...updatedIssue } : issue
    );
    setIssues(updatedIssues);
  };

  // Фильтрация и поиск задач
  const filteredIssues = issues.filter((issue) => {
    let matchesSearch = true;
    let matchesStatus = true;
    let matchesBoard = true;

    if (searchQuery) {
      matchesSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.assignee.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    }

    if (statusFilter) {
      matchesStatus = issue.status === statusFilter;
    }

    if (boardFilter) {
      matchesBoard = issue.boardName === boardFilter;
    }

    return matchesSearch && matchesStatus && matchesBoard;
  });

  return (
    <div className="issues-page">
      {/* Стилизованный заголовок */}
      <Box
        sx={{
          backgroundColor: '#1976d2', // Цвет фона как у кнопки
          color: '#fff', // Цвет текста как у кнопки
          padding: '16px',
          width: '50%',
          margin: '0 auto',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Тень для объемного эффекта
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          style={{
            fontWeight: 600,
            textTransform: 'none',
            margin: 0,
          }}
        >
          Все задачи
        </Typography>
      </Box>

      <div className="controls">
        <SearchBar onSearch={setSearchQuery} />
        <Filters
          onStatusFilter={setStatusFilter}
          onBoardFilter={setBoardFilter}
        />
      </div>

      {/* Кнопка создания задачи */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        style={{
          marginBottom: '16px',
          textTransform: 'none',
        }}
      >
        Создать задачу
      </Button>

      {/* Список задач */}
      <IssuesList
        issues={filteredIssues}
        onEditIssue={(task) => {
          setSelectedTask(task);
          setIsModalOpen(true);
        }}
      />

      {/* Модальное окно */}
      <TaskFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={(data) => {
          if (selectedTask) {
            handleEditIssue(data as UpdateTaskRequest);
          } else {
            handleCreateIssue(data as CreateTaskRequest);
          }
        }}
        task={selectedTask}
        mode={selectedTask ? 'edit' : 'create'}
        boardLink={selectedTask ? `/boards/${selectedTask.boardId}` : undefined}
      />
    </div>
  );
};

export default IssuesPage;