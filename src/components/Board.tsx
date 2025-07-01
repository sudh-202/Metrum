import React, { useState, useMemo, useContext } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Status, Task } from '../types';
import Column from './Column';
import TaskCard from './TaskCard';
import Modal from './Modal';
import TaskForm from './TaskForm';
import useTaskStore from '../hooks/useTaskStore';
import useDebounce from '../hooks/useDebounce';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Board component that displays the Kanban board with all columns and tasks
 */
interface BoardProps {
  onAddTask?: () => void;
}

const Board: React.FC<BoardProps> = ({ onAddTask }) => {
  const { board, searchTerm, priorityFilter, moveTask, reorderTasks, updateTask, deleteTask, setSearchTerm, setPriorityFilter } = useTaskStore();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Get active task when dragging
  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    return board.tasks[activeTaskId];
  }, [activeTaskId, board.tasks]);
  
  // Filter tasks based on search term and priority filter
  const getFilteredTasks = (columnId: Status) => {
    // Check if column exists in board.columns
    if (!board.columns || !board.columns[columnId]) {
      console.error(`Column ${columnId} not found in board.columns`);
      return [];
    }
    
    const columnTaskIds = board.columns[columnId].taskIds || [];
    return columnTaskIds
      .map(taskId => board.tasks[taskId])
      .filter(task => {
        // Skip if task is undefined
        if (!task) return false;
        
        // Filter by search term
        const matchesSearch = debouncedSearchTerm
          ? task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          : true;
        
        // Filter by priority
        const matchesPriority = priorityFilter
          ? task.priority === priorityFilter
          : true;
        
        return matchesSearch && matchesPriority;
      });
  };
  
  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTaskId(active.id as string);
  };
  
  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // If task is dragged over another task
    if (activeId === overId) return;
    
    const activeTask = board.tasks[activeId];
    const isOverAColumn = Object.values(Status).includes(overId as Status);
    
    if (isOverAColumn) {
      const newStatus = overId as Status;
      if (activeTask.status !== newStatus) {
        moveTask(activeId, activeTask.status, newStatus);
      }
    }
  };
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTaskId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) {
      setActiveTaskId(null);
      return;
    }
    
    const activeTask = board.tasks[activeId];
    const isOverAColumn = Object.values(Status).includes(overId as Status);
    
    if (isOverAColumn) {
      // Already handled in dragOver
    } else {
      // Task is dropped over another task, reorder within the same column
      const activeStatus = activeTask.status;
      const activeIndex = board.columns[activeStatus].taskIds.indexOf(activeId);
      const overTask = board.tasks[overId];
      
      if (overTask && activeStatus === overTask.status) {
        const overIndex = board.columns[activeStatus].taskIds.indexOf(overId);
        reorderTasks(activeStatus, activeIndex, overIndex);
      }
    }
    
    setActiveTaskId(null);
  };
  
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-6 pb-6 px-2 pt-2 md:flex-row flex-col overflow-visible md:overflow-x-auto">
          {Object.values(Status).map((status) => {
            // Check if board and columns are properly initialized
            if (!board || !board.columns) {
              console.error('Board or columns not properly initialized');
              return null;
            }
            
            // Check if this specific column exists
            if (!board.columns[status]) {
              console.error(`Column ${status} not found in board.columns`);
              return null;
            }
            
            const filteredTasks = getFilteredTasks(status);
            const columnWidth = 'w-full md:w-[350px] md:min-w-[350px]';
            
            return (
              <div 
                key={status}
                className={`${columnWidth}`}
              >
                <Column
                  column={board.columns[status]}
                  tasks={filteredTasks}
                  onEdit={(task) => {
                    setEditingTaskId(task.id);
                    setIsTaskFormOpen(true);
                  }}
                  onDelete={(taskId) => deleteTask(taskId)}
                  onAddTask={onAddTask}
                />
              </div>
            );
          })}
        </div>
        
        {/* Drag overlay */}
        <DragOverlay adjustScale style={{ transformOrigin: '0 0' }}>
          {activeTask ? (
            <div className="w-[350px] opacity-90 rotate-3 shadow-xl">
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {/* Task edit modal */}
      <AnimatePresence>
        {editingTaskId && (
          <Modal 
            isOpen={isTaskFormOpen} 
            onClose={() => setIsTaskFormOpen(false)}
            title={`Edit Task`}
          >
            <TaskForm
              task={board.tasks[editingTaskId]}
              onSubmit={(taskData) => {
                updateTask(editingTaskId, taskData);
                setIsTaskFormOpen(false);
                setEditingTaskId(null);
              }}
              onCancel={() => {
                setIsTaskFormOpen(false);
                setEditingTaskId(null);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Board;