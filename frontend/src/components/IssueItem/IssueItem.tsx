import  { useState } from 'react';
import { GetTasksResponse, UpdateTaskRequest } from '../../types';
import IssueModal from '../IssueModal/IssueModal';


const IssueItem = ({
  issue,
  onEdit,
}: {
  issue: GetTasksResponse;
  onEdit: (taskId: number, updatedIssue: UpdateTaskRequest) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="issue-item" onClick={() => setIsOpen(true)}>
      <h3>{issue.title}</h3>
      <p>Статус: {issue.status}</p>
      <p>Исполнитель: {issue.assignee.fullName}</p>
      <p>Доска: {issue.boardName}</p>
      {isOpen && (
        <IssueModal
          issue={issue}
          onClose={() => setIsOpen(false)}
          onSave={(updatedIssue) => onEdit(issue.id, updatedIssue)}
        />
      )}
    </div>
  );
};

export default IssueItem;