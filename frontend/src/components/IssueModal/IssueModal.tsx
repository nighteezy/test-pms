import { useState } from 'react';
import { GetTasksResponse, UpdateTaskRequest } from '../../types';

const IssueModal = ({
  issue,
  onClose,
  onSave,
}: {
  issue: GetTasksResponse;
  onClose: () => void;
  onSave: (updatedIssue: UpdateTaskRequest) => void;
}) => {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [priority, setPriority] = useState(issue.priority);
  const [status, setStatus] = useState(issue.status);
  const [assigneeId, setAssigneeId] = useState(issue.assignee.id);

  const handleSubmit = () => {
    const updatedIssue = {
      title,
      description,
      priority,
      status,
      assigneeId,
    };
    onSave(updatedIssue);
    onClose();
  };

  return (
    <div className="modal">
      <h2>Редактирование задачи</h2>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value as "Backlog" | "InProgress" | "Done")}>
        <option value="Backlog">Backlog</option>
        <option value="InProgress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <input
        type="number"
        placeholder="ID исполнителя"
        value={assigneeId}
        onChange={(e) => setAssigneeId(Number(e.target.value))}
      />
      <button onClick={handleSubmit}>Сохранить</button>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
};

export default IssueModal;