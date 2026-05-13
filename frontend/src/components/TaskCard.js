import React, { useState } from 'react';

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task._id);
    setIsDeleting(false);
  };

  const priorityColors = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
  };

  const priorityLabels = {
    low: '↓ Low',
    medium: '→ Medium',
    high: '↑ High',
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`task-card ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-card-left">
        <button
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task._id, !task.completed)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && <span>✓</span>}
        </button>
      </div>

      <div className="task-card-body">
        <h3 className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span className={`priority-badge ${priorityColors[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
          <span className="task-date">{formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className="task-card-actions">
        <button
          className="task-btn task-btn-edit"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          title="Edit"
        >
          ✎
        </button>
        <button
          className={`task-btn task-btn-delete ${isDeleting ? 'deleting' : ''}`}
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete task"
          title="Delete"
        >
          {isDeleting ? '...' : '✕'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
