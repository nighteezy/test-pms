import React from 'react';
import { List, ListItem, ListItemText, Divider, Paper, Typography } from '@mui/material';
import { GetTasksResponse } from '../../types';

interface IssuesListProps {
  issues: GetTasksResponse[];
  onEditIssue: (task: GetTasksResponse) => void; // Ожидаем полный объект задачи
}

const IssuesList: React.FC<IssuesListProps> = ({ issues, onEditIssue }) => {
  return (
    <Paper elevation={3} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
      <List>
        {issues.length > 0 ? (
          issues.map((issue) => (
            <React.Fragment key={issue.id}>
              <ListItem
                component="div"
                onClick={() => onEditIssue(issue)} // Передаем полный объект задачи
                style={{
                  backgroundColor: getBackgroundColor(issue.priority),
                  marginBottom: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <ListItemText
                  primary={issue.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" component="span">
                        Status: {issue.status}
                      </Typography>
                      <br />
                      <Typography variant="body2" color="text.secondary" component="span">
                        Assignee: {issue.assignee.fullName}
                      </Typography>
                      <br />
                      <Typography variant="body2" color="text.secondary" component="span">
                        Board: {issue.boardName}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="Нет задач для отображения" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

// Функция для определения цвета фона на основе приоритета задачи
const getBackgroundColor = (priority: 'Low' | 'Medium' | 'High'): string => {
  switch (priority) {
    case 'Low':
      return '#e8f5e9'; // Light green
    case 'Medium':
      return '#fff3e0'; // Light orange
    case 'High':
      return '#ffebee'; // Light red
    default:
      return '#ffffff'; // White
  }
};

export default IssuesList;