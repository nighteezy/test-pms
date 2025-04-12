import React from 'react';
import { createRoot } from 'react-dom/client'; // Импортируем createRoot
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error("Не удалось найти элемент с id 'root'");
}

const root = createRoot(container); // Создаем корневой элемент
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </React.StrictMode>
);
