/**
 * Type definitions for the TaskFlow application
 */

/**
 * Task priority levels
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Task status categories
 */
export enum Status {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

/**
 * Task interface
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate?: Date | null; // optional due date
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

/**
 * Column interface for Kanban board
 */
export interface Column {
  id: Status;
  title: string;
  taskIds: string[];
}

/**
 * Board interface containing all columns
 */
export interface Board {
  columns: {
    [key in Status]: Column;
  };
  tasks: {
    [key: string]: Task;
  };
}