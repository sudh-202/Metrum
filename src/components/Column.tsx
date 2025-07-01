import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Status, Task } from '../types';
import SortableTaskCard from './SortableTaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAddTask?: () => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onEdit, onDelete, onAddTask }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  // Column background colors based on column id using the updated color palette
  const columnStyles = {
    todo: 'bg-neutral-50 border-t-4 border-blue',
    'in-progress': 'bg-neutral-50 border-t-4 border-pink',
    done: 'bg-neutral-50 border-t-4 border-lavender',
  };

  // Get the appropriate style for this column
  const columnStyle = columnStyles[column.id as keyof typeof columnStyles] || 'bg-neutral-50 border-t-4 border-neutral-400';

  // Calculate dynamic height based on number of tasks and screen size
  const getColumnHeight = () => {
    const baseHeight = 500; // Base height for 0-2 tasks
    const additionalHeight = Math.max(0, tasks.length - 2) * 100; // Add 100px for each task beyond 2
    return `${baseHeight + additionalHeight}px`;
  };

  return (
    <div 
      className={`${columnStyle} p-4 rounded-xl shadow-card w-full md:w-[350px] md:min-w-[350px] flex flex-col transition-all duration-300 hover:shadow-card-hover mb-6 md:mb-0`}
      style={{ minHeight: getColumnHeight() }}
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-neutral-800">{column.title}</h2>
          <span className="ml-2 bg-neutral-200 text-neutral-700 text-xs px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-3 overflow-y-auto"
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              id={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6 border-2 border-dashed border-neutral-300 rounded-lg bg-neutral-50 w-full">
              <p className="text-neutral-500 mb-3">
                {column.id === Status.TODO && 'No tasks yet'}
                {column.id === Status.IN_PROGRESS && 'No tasks in progress'}
                {column.id === Status.DONE && 'No completed tasks'}
              </p>
              <button 
                onClick={onAddTask}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors duration-200"
              >
                + Add a task
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add task button at the bottom of column */}
      <button 
        onClick={onAddTask}
        className="mt-4 w-full py-2 bg-white border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors duration-200 flex items-center justify-center shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Task
      </button>
    </div>
  );
};

export default Column;