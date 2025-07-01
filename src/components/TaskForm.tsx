import React, { useState, useEffect } from 'react';
import { Priority, Status, Task } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

// Priority color mapping for the selector using the updated color palette
const priorityStyles = {
  [Priority.LOW]: {
    bg: 'bg-success-100',
    text: 'text-success-800',
    border: 'border-success-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  [Priority.MEDIUM]: {
    bg: 'bg-warning-100',
    text: 'text-warning-800',
    border: 'border-warning-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  [Priority.HIGH]: {
    bg: 'bg-danger-100',
    text: 'text-danger-800',
    border: 'border-danger-200',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
};

/**
 * TaskForm component for creating and editing tasks
 */
const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || Priority.MEDIUM);
  const [status, setStatus] = useState<Status>(task?.status || Status.TODO);
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate || null);
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate || null);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
    });
    
    // Reset form
    if (!task) {
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
      setStatus(Status.TODO);
      setDueDate(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
          Title <span className="text-danger-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${errors.title ? 'border-danger-500 bg-danger-50' : 'border-neutral-300'}`}
          placeholder="What needs to be done?"
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-danger-500 text-xs mt-1 font-medium">{errors.title}</p>
        )}
      </div>
      
      <div className="mb-5">
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          placeholder="Add details about this task..."
          rows={4}
        />
      </div>
      
      <div className="mb-5">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Priority
        </label>
        <div className="flex space-x-2">
          {Object.values(Priority).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex items-center px-3 py-2 rounded-lg border ${priority === p ? `${priorityStyles[p].bg} ${priorityStyles[p].text} ${priorityStyles[p].border} ring-2 ring-offset-1 ring-${p === Priority.LOW ? 'success' : p === Priority.MEDIUM ? 'warning' : 'danger'}-400` : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'} transition-all duration-200`}
            >
              {priorityStyles[p].icon}
              {p === Priority.LOW ? 'Low' : p === Priority.MEDIUM ? 'Medium' : 'High'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-5">
        <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 bg-white"
        >
          <option value={Status.TODO}>To Do</option>
          <option value={Status.IN_PROGRESS}>In Progress</option>
          <option value={Status.DONE}>Done</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
          Due Date
        </label>
        <DatePicker
          id="dueDate"
          selected={dueDate}
          onChange={(date: Date | null) => setDueDate(date)}
          dateFormat="MMMM d, yyyy"
          placeholderText="Select a due date"
          className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 bg-white"
          isClearable
        />  
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;