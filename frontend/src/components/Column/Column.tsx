// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Box, Typography, Paper, List, ListItem, ListItemText} from '@mui/material';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { GetTasksResponse } from '../../types';

// const BoardPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [tasks, setTasks] = useState<GetTasksResponse[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState<GetTasksResponse | null>(null);

//   // Загрузка задач для доски
//   useEffect(() => {
//     const loadTasks = async () => {
//       try {
//         const boardId = Number(id);
//         const tasksData = await fetchBoardTasks(boardId);
//         setTasks(tasksData);
//       } catch (err) {
//         console.error('Ошибка при загрузке задач:', err);
//       }
//     };

//     loadTasks();
//   }, [id]);

//   // Обновление задачи
//   const handleUpdateTask = async (updatedTask: UpdateTaskRequest) => {
//     if (!selectedTask) return;

//     try {
//       await updateTask(selectedTask.id, updatedTask);
//       const updatedTasks = tasks.map((task) =>
//         task.id === selectedTask.id ? { ...task, ...updatedTask } : task
//       );
//       setTasks(updatedTasks);
//     } catch (err) {
//       console.error('Ошибка при обновлении задачи:', err);
//     }
//   };

//   // Перемещение задачи между колонками
//   const onDragEnd = (result: any) => {
//     const { source, destination } = result;

//     // Если задача не была перенесена в другую колонку
//     if (!destination) return;

//     // Если задача осталась в той же колонке и на том же месте
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     // Получаем текущий список задач
//     const sourceStatus = source.droppableId as 'Backlog' | 'InProgress' | 'Done';
//     const destinationStatus = destination.droppableId as 'Backlog' | 'InProgress' | 'Done';

//     const updatedTasks = [...tasks];
//     const [movedTask] = updatedTasks.splice(source.index, 1);
//     movedTask.status = destinationStatus; // Обновляем статус задачи
//     updatedTasks.splice(destination.index, 0, movedTask);

//     // Обновляем состояние задач
//     setTasks(updatedTasks);
//   };

//   // Группировка задач по статусам
//   const groupedTasks = {
//     Backlog: tasks.filter((task) => task.status === 'Backlog'),
//     InProgress: tasks.filter((task) => task.status === 'InProgress'),
//     Done: tasks.filter((task) => task.status === 'Done'),
//   };

//   return (
//     <Box sx={{ padding: '24px' }}>
//       {/* Заголовок страницы */}
//       <Typography variant="h4" component="h1" gutterBottom>
//         Доска #{id}
//       </Typography>

//       {/* Drag-and-Drop контекст */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Box display="flex" gap={3}>
//           {['Backlog', 'InProgress', 'Done'].map((status) => (
//             <Droppable key={status} droppableId={status}>
//               {(provided) => (
//                 <Paper
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                   sx={{
//                     width: '30%',
//                     padding: '16px',
//                     minHeight: '200px',
//                     backgroundColor: '#f9f9f9',
//                     borderRadius: '8px',
//                   }}
//                 >
//                   <Typography variant="h5" gutterBottom>
//                     {status}
//                   </Typography>
//                   <List>
//                     {groupedTasks[status as keyof typeof groupedTasks].map((task, index) => (
//                       <Draggable key={task.id} draggableId={String(task.id)} index={index}>
//                         {(provided) => (
//                           <ListItem
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             onClick={() => {
//                               setSelectedTask(task);
//                               setIsModalOpen(true);
//                             }}
//                             sx={{
//                               backgroundColor: '#fff',
//                               marginBottom: '8px',
//                               padding: '12px',
//                               borderRadius: '4px',
//                               cursor: 'pointer',
//                               boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//                             }}
//                           >
//                             <ListItemText
//                               primary={task.title}
//                               secondary={
//                                 <>
//                                   <Typography variant="body2" color="text.secondary">
//                                     Исполнитель: {task.assignee.fullName}
//                                   </Typography>
//                                   <Typography variant="caption" color="text.secondary">
//                                     Приоритет: {task.priority}
//                                   </Typography>
//                                 </>
//                               }
//                             />
//                           </ListItem>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </List>
//                 </Paper>
//               )}
//             </Droppable>
//           ))}
//         </Box>
//       </DragDropContext>

//       {/* Модальное окно редактирования задачи */}
//       <TaskFormModal
//         open={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedTask(null);
//         }}
//         onSave={(data) => {
//           handleUpdateTask(data as UpdateTaskRequest);
//           setIsModalOpen(false);
//         }}
//         task={selectedTask}
//         mode="edit"
//         boardLink={`/boards/${id}`}
//       />
//     </Box>
//   );
// };

// export default BoardPage;