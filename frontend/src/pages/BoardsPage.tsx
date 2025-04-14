import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { fetchBoards } from '../api/boardsApi';
import { GetBoardsResponse } from '../types';

const BoardsPage: React.FC = () => {
  const [boards, setBoards] = useState<GetBoardsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных досок
  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await fetchBoards();
        setBoards(boardsData);
      } catch (err) {
        console.error('Ошибка при загрузке досок:', err);
        setError('Не удалось загрузить доски');
      } finally {
        setLoading(false);
      }
    };

    loadBoards();
  }, []);

  return (
    <Box sx={{ padding: '24px' }}>
      {/* Стилизованный заголовок */}
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" component="h1" style={{ fontWeight: 600, margin: 0 }}>
          Проекты
        </Typography>
      </Box>

      {/* Обработка загрузки и ошибок */}
      {loading ? (
        <Typography variant="body1" align="center">
          Загрузка проектов...
        </Typography>
      ) : error ? (
        <Typography variant="body1" align="center" color="error">
          {error}
        </Typography>
      ) : boards.length === 0 ? (
        <Typography variant="body1" align="center">
          Нет доступных проектов.
        </Typography>
      ) : (
        // Список досок
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px', // Отступ между карточками
          }}
        >
          {boards.map((board) => (
            <Card
              key={board.id}
              sx={{
                width: '100%',
                maxWidth: '345px', // Максимальная ширина карточки
                flex: '1 1 calc(33.33% - 24px)', // Адаптивность для больших экранов
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
            >
              <CardActionArea
                component={Link}
                to={`/board/${board.id}`} // Переход на страницу доски
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {board.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {board.description || 'Нет описания'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ marginTop: '8px' }}>
                    Задач: {board.taskCount}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BoardsPage;