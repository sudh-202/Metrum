import { Board, Priority, Status } from '../types';

/**
 * Initial data structure for the TaskFlow Kanban board
 */
export const initialBoard: Board = {
  columns: {
    [Status.TODO]: {
      id: Status.TODO,
      title: 'To Do',
      taskIds: [],
    },
    [Status.IN_PROGRESS]: {
      id: Status.IN_PROGRESS,
      title: 'In Progress',
      taskIds: [],
    },
    [Status.DONE]: {
      id: Status.DONE,
      title: 'Done',
      taskIds: [],
    },
  },
  tasks: {},
};

/**
 * Sample tasks for demonstration
 */
export const sampleTasks = {
  'task-1': {
    id: 'task-1',
    title: 'Create project structure',
    description: 'Set up folders and initial configuration',
    priority: Priority.HIGH,
    status: Status.DONE,
    dueDate: new Date(Date.now() - 43200000), // Due date in the past
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 43200000, // 12 hours ago
  },
  'task-2': {
    id: 'task-2',
    title: 'Implement drag and drop',
    description: 'Add DnD functionality between columns',
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
    dueDate: new Date(Date.now() + 86400000), // Due date tomorrow
    createdAt: Date.now() - 43200000, // 12 hours ago
    updatedAt: Date.now() - 21600000, // 6 hours ago
  },
  'task-3': {
    id: 'task-3',
    title: 'Add task filtering',
    description: 'Implement search and priority filtering',
    priority: Priority.LOW,
    status: Status.TODO,
    dueDate: new Date(Date.now() + 259200000), // Due date in 3 days
    createdAt: Date.now() - 21600000, // 6 hours ago
    updatedAt: Date.now() - 21600000, // 6 hours ago
  },
};

/**
 * Sample board with tasks for demonstration
 */
export const sampleBoard: Board = {
  columns: {
    [Status.TODO]: {
      id: Status.TODO,
      title: 'To Do',
      taskIds: ['task-3'],
    },
    [Status.IN_PROGRESS]: {
      id: Status.IN_PROGRESS,
      title: 'In Progress',
      taskIds: ['task-2'],
    },
    [Status.DONE]: {
      id: Status.DONE,
      title: 'Done',
      taskIds: ['task-1'],
    },
  },
  tasks: sampleTasks,
};