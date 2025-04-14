import React from "react";

import { GetTasksOnBoardResponse } from "../../types";
import TaskItem from "../TaskItem/TaskItem";

interface TaskListProps {
  tasks: GetTasksOnBoardResponse[];
  onEditTask: (task: GetTasksOnBoardResponse) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask }) => {
  const moveTaskWithinColumn = (dragIndex: number, hoverIndex: number) => {
    console.log(`Moving task from index ${dragIndex} to ${hoverIndex}`);
    // Здесь можно добавить логику для обновления состояния задач
  };

  return (
    <div>
      {tasks.length > 0 ? (
        tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            status={task.status}
            moveTaskWithinColumn={moveTaskWithinColumn}
            onEditTask={onEditTask}
          />
        ))
      ) : (
        <p>Нет задач для отображения.</p>
      )}
    </div>
  );
};

export default TaskList;
