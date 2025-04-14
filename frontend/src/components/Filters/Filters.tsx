import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { GetBoardsResponse } from '../../types';
import { fetchBoards } from '../../api/boardsApi';


interface FiltersProps {
  onStatusFilter: (status: string | null) => void;
  onBoardFilter: (board: string | null) => void;
}

const Filters: React.FC<FiltersProps> = ({ onStatusFilter, onBoardFilter }) => {
  const [boards, setBoards] = useState<GetBoardsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка досок при монтировании
  useEffect(() => {
    const loadBoards = async () => {
      try {
        const fetchedBoards = await fetchBoards();
        setBoards(fetchedBoards);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке досок:', err);
        setError('Не удалось загрузить доски');
        setLoading(false);
      }
    };
    loadBoards();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
      {/* Фильтр по статусу */}
      <FormControl fullWidth variant="outlined">
        <InputLabel>Статус</InputLabel>
        <Select
          label="Статус"
          defaultValue=""
          onChange={(e) => onStatusFilter(e.target.value as string || null)}
        >
          <MenuItem value="">Все статусы</MenuItem>
          {['Backlog', 'InProgress', 'Done'].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Фильтр по доске */}
      <FormControl fullWidth variant="outlined">
        <InputLabel>Доска</InputLabel>
        <Select
          label="Доска"
          defaultValue=""
          onChange={(e) => onBoardFilter(e.target.value as string || null)}
        >
          <MenuItem value="">Все доски</MenuItem>
          {loading ? (
            <MenuItem disabled>Загрузка...</MenuItem>
          ) : error ? (
            <MenuItem disabled>{error}</MenuItem>
          ) : (
            boards.map((board) => (
              <MenuItem key={board.id} value={board.name}>
                {board.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </div>
  );
};

export default Filters;