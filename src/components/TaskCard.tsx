import React from 'react';
import { Task, Priority, Status } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors = {
  [Priority.LOW]: 'bg-success-100 text-success-800 border-success-200',
  [Priority.MEDIUM]: 'bg-warning-100 text-warning-800 border-warning-200',
  [Priority.HIGH]: 'bg-red text-white border-red',
};

const priorityLabels = {
  [Priority.LOW]: 'Low',
  [Priority.MEDIUM]: 'Medium',
  [Priority.HIGH]: 'High',
};

const priorityIcons = {
  [Priority.LOW]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ),
  [Priority.MEDIUM]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  ),
  [Priority.HIGH]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  // Get due date from task or use null
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  
  // Check if task is due soon (within 2 days) if dueDate exists
  const isDueSoon = dueDate ? 
    dueDate.getTime() - new Date().getTime() < 2 * 24 * 60 * 60 * 1000 : 
    false;
    
  // Status labels mapping
  const statusLabels = {
    [Status.TODO]: 'To Do',
    [Status.IN_PROGRESS]: 'In Progress',
    [Status.DONE]: 'Done',
  };
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 border border-neutral-200 group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-neutral-800 line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
          {task.title}
        </h3>
        <div className="flex space-x-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-neutral-400 hover:text-primary-500 p-1 rounded transition-colors duration-200"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-neutral-400 hover:text-danger-500 p-1 rounded transition-colors duration-200"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {task.description}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <span 
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}
        >
          {priorityIcons[task.priority]}
          {priorityLabels[task.priority]}
        </span>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
            {statusLabels[task.status]}
          </span>
          {dueDate && (
            <span className={`text-xs ${isDueSoon ? 'text-danger-600 font-medium' : 'text-neutral-500'}`}>
              Due {formatDistanceToNow(dueDate, { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-xs text-neutral-400">
          Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;