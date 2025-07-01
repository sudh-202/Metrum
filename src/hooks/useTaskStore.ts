import { create } from 'zustand';
import { Board, Priority, Status, Task } from '../types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';
import { initialBoard, sampleBoard } from '../data/initialData';

// Load board from localStorage or use sample data for first-time users
const storedBoard = loadFromLocalStorage<Board>('taskflow-board', sampleBoard);

// Ensure all required columns exist in the board
const ensureValidBoard = (board: Board): Board => {
  // Create a copy of the board
  const validBoard: Board = {
    columns: { ...board.columns },
    tasks: { ...board.tasks }
  };
  
  // Ensure all status columns exist
  Object.values(Status).forEach(status => {
    if (!validBoard.columns[status]) {
      validBoard.columns[status] = {
        id: status,
        title: status === Status.TODO ? 'To Do' : 
               status === Status.IN_PROGRESS ? 'In Progress' : 'Done',
        taskIds: []
      };
    }
  });
  
  return validBoard;
};

// Apply validation to ensure board structure is complete
const validatedBoard = ensureValidBoard(storedBoard);

interface TaskStore {
  board: Board;
  searchTerm: string;
  priorityFilter: Priority | null;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (taskId: string) => void;
  
  // Column actions
  moveTask: (taskId: string, sourceStatus: Status, destinationStatus: Status) => void;
  reorderTasks: (sourceStatus: Status, startIndex: number, endIndex: number) => void;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setPriorityFilter: (priority: Priority | null) => void;
  
  // Reset action
  resetBoard: () => void;
}

const useTaskStore = create<TaskStore>((set, get) => ({
  board: validatedBoard,
  searchTerm: '',
  priorityFilter: null,
  
  // Task actions
  addTask: (task) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      ...task,
      id: newTaskId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    set((state) => {
      // Ensure the board has all required columns
      const currentBoard = ensureValidBoard(state.board);
      
      // Create new board state
      const newBoard: Board = {
        columns: {
          ...currentBoard.columns,
          [task.status]: {
            ...currentBoard.columns[task.status],
            taskIds: [...(currentBoard.columns[task.status]?.taskIds || []), newTaskId],
          },
        },
        tasks: {
          ...currentBoard.tasks,
          [newTaskId]: newTask,
        },
      };
      
      // Validate the new board
      const validatedNewBoard = ensureValidBoard(newBoard);
      
      // Save to localStorage
      saveToLocalStorage('taskflow-board', validatedNewBoard);
      
      return { board: validatedNewBoard };
    });
  },
  
  updateTask: (taskId, updates) => {
    set((state) => {
      // Ensure the board has all required columns
      const currentBoard = ensureValidBoard(state.board);
      
      const task = currentBoard.tasks[taskId];
      if (!task) return state;
      
      const updatedTask: Task = {
        ...task,
        ...updates,
        updatedAt: Date.now(),
      };
      
      // Handle status change if needed
      let newColumns = { ...currentBoard.columns };
      if (updates.status && updates.status !== task.status) {
        // Ensure both old and new status columns exist
        if (!newColumns[task.status]) {
          newColumns[task.status] = {
            id: task.status,
            title: task.status === Status.TODO ? 'To Do' : 
                   task.status === Status.IN_PROGRESS ? 'In Progress' : 'Done',
            taskIds: [],
          };
        }
        
        if (!newColumns[updates.status]) {
          newColumns[updates.status] = {
            id: updates.status,
            title: updates.status === Status.TODO ? 'To Do' : 
                   updates.status === Status.IN_PROGRESS ? 'In Progress' : 'Done',
            taskIds: [],
          };
        }
        
        // Remove from old status column
        newColumns = {
          ...newColumns,
          [task.status]: {
            ...newColumns[task.status],
            taskIds: (newColumns[task.status].taskIds || []).filter(id => id !== taskId),
          },
          // Add to new status column
          [updates.status]: {
            ...newColumns[updates.status],
            taskIds: [...(newColumns[updates.status].taskIds || []), taskId],
          },
        };
      }
      
      const newBoard: Board = {
        columns: newColumns,
        tasks: {
          ...currentBoard.tasks,
          [taskId]: updatedTask,
        },
      };
      
      // Validate the new board
      const validatedNewBoard = ensureValidBoard(newBoard);
      
      // Save to localStorage
      saveToLocalStorage('taskflow-board', validatedNewBoard);
      
      return { board: validatedNewBoard };
    });
  },
  
  deleteTask: (taskId) => {
    set((state) => {
      // Ensure the board has all required columns
      const currentBoard = ensureValidBoard(state.board);
      
      const task = currentBoard.tasks[taskId];
      if (!task) return state;
      
      // Create a copy of tasks without the deleted task
      const { [taskId]: deletedTask, ...remainingTasks } = currentBoard.tasks;
      
      // Ensure the column exists
      let newColumns = { ...currentBoard.columns };
      if (!newColumns[task.status]) {
        newColumns[task.status] = {
          id: task.status,
          title: task.status === Status.TODO ? 'To Do' : 
                 task.status === Status.IN_PROGRESS ? 'In Progress' : 'Done',
          taskIds: [],
        };
      }
      
      // Remove task ID from its column
      newColumns = {
        ...newColumns,
        [task.status]: {
          ...newColumns[task.status],
          taskIds: (newColumns[task.status].taskIds || []).filter(id => id !== taskId),
        },
      };
      
      const newBoard: Board = {
        columns: newColumns,
        tasks: remainingTasks,
      };
      
      // Validate the new board
      const validatedNewBoard = ensureValidBoard(newBoard);
      
      // Save to localStorage
      saveToLocalStorage('taskflow-board', validatedNewBoard);
      
      return { board: validatedNewBoard };
    });
  },
  
  // Column actions
  moveTask: (taskId, sourceStatus, destinationStatus) => {
    set((state) => {
      // Ensure the board has all required columns
      const currentBoard = ensureValidBoard(state.board);
      
      // Ensure task exists
      const task = currentBoard.tasks[taskId];
      if (!task) return state;
      
      // Ensure both source and destination columns exist
      let newColumns = { ...currentBoard.columns };
      
      // Ensure source column exists
      if (!newColumns[sourceStatus]) {
        newColumns[sourceStatus] = {
          id: sourceStatus,
          title: sourceStatus === Status.TODO ? 'To Do' : 
                 sourceStatus === Status.IN_PROGRESS ? 'In Progress' : 'Done',
          taskIds: [],
        };
      }
      
      // Ensure destination column exists
      if (!newColumns[destinationStatus]) {
        newColumns[destinationStatus] = {
          id: destinationStatus,
          title: destinationStatus === Status.TODO ? 'To Do' : 
                 destinationStatus === Status.IN_PROGRESS ? 'In Progress' : 'Done',
          taskIds: [],
        };
      }
      
      // Create new columns with task moved
      newColumns = {
        ...newColumns,
        [sourceStatus]: {
          ...newColumns[sourceStatus],
          taskIds: (newColumns[sourceStatus].taskIds || []).filter(id => id !== taskId),
        },
        [destinationStatus]: {
          ...newColumns[destinationStatus],
          taskIds: [...(newColumns[destinationStatus].taskIds || []), taskId],
        },
      };
      
      // Update task status
      const updatedTask: Task = {
        ...task,
        status: destinationStatus,
        updatedAt: Date.now(),
      };
      
      const newBoard: Board = {
        columns: newColumns,
        tasks: {
          ...currentBoard.tasks,
          [taskId]: updatedTask,
        },
      };
      
      // Validate the new board
      const validatedNewBoard = ensureValidBoard(newBoard);
      
      // Save to localStorage
      saveToLocalStorage('taskflow-board', validatedNewBoard);
      
      return { board: validatedNewBoard };
    });
  },
  
  reorderTasks: (status, startIndex, endIndex) => {
    set((state) => {
      // Ensure the board has all required columns
      const currentBoard = ensureValidBoard(state.board);
      
      // Ensure the column exists
      if (!currentBoard.columns[status]) {
        return state;
      }
      
      const column = currentBoard.columns[status];
      const taskIds = column.taskIds || [];
      
      // Check if indices are valid
      if (startIndex < 0 || startIndex >= taskIds.length || 
          endIndex < 0 || endIndex >= taskIds.length) {
        return state;
      }
      
      const newTaskIds = [...taskIds];
      
      // Reorder task IDs in the column
      const [movedTaskId] = newTaskIds.splice(startIndex, 1);
      newTaskIds.splice(endIndex, 0, movedTaskId);
      
      const newBoard: Board = {
        ...currentBoard,
        columns: {
          ...currentBoard.columns,
          [status]: {
            ...column,
            taskIds: newTaskIds,
          },
        },
      };
      
      // Validate the new board
      const validatedNewBoard = ensureValidBoard(newBoard);
      
      // Save to localStorage
      saveToLocalStorage('taskflow-board', validatedNewBoard);
      
      return { board: validatedNewBoard };
    });
  },
  
  // Filter actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  
  // Reset action
  resetBoard: () => {
    const validInitialBoard = ensureValidBoard(initialBoard);
    set({ board: validInitialBoard });
    saveToLocalStorage('taskflow-board', validInitialBoard);
  },
}));

export default useTaskStore;