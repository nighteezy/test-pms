import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { fetchBoards } from '../api/boardsApi';
import { GetBoardsResponse } from '../types';

const BoardsPage: React.FC = () => {
  const [boards, setBoards] = useState<GetBoardsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await fetchBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error('Error loading boards:', error);
        setError('Ошибка при загрузке досок');
      } finally {
        setLoading(false);
      }
    };

    loadBoards();
  }, []);

  if (loading) {
    return <Box>Загрузка...</Box>;
  }

  if (error) {
    return <Box>{error}</Box>;
  }

  return (
    <Box>
      <h1>Доски</h1>

      {/* Кнопка для создания новой доски */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/boards/create"
        sx={{ marginBottom: '20px' }}
      >
        Создать новую доску
      </Button>

      {/* Список досок */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {boards.length > 0 ? (
          boards.map((board) => (
            <Card key={board.id} sx={{ width: '100%', maxWidth: 345 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {board.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {board.description || 'Нет описания'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Задач: {board.taskCount}
                </Typography>
                <Button
                  component={Link}
                  to={`/board/${board.id}`}
                  variant="outlined"
                  size="small"
                  sx={{ marginTop: '10px', display: 'block' }}
                >
                  Перейти к доске
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box>Нет доступных досок.</Box>
        )}
      </Box>
    </Box>
  );
};

export default BoardsPage;