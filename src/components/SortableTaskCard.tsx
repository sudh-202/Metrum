import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface SortableTaskCardProps {
  id: string;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

/**
 * SortableTaskCard wraps TaskCard with drag-and-drop functionality
 */
const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ id, task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  // Handle click on the card to edit task
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger edit if the click was directly on the card (not on buttons)
    if (e.target === e.currentTarget) {
      onEdit(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation cursor-grab active:cursor-grabbing transition-transform duration-200 animate-fadeIn"
      aria-roledescription="Draggable task"
      onClick={handleCardClick}
    >
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default SortableTaskCard;