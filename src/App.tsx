import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Board from './components/Board';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';
import useTaskStore from './hooks/useTaskStore';
import { Task } from './types';

function App() {
  const { addTask, updateTask, deleteTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  // Add Inter font from Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 font-sans">
      <Header onAddTask={handleAddTask} />
      
      <main className="flex p-4 md:p-6 overflow-visible">
        <div className="max-w-7xl mx-auto h-full">
          <Board onAddTask={handleAddTask} />
        </div>
      </main>
      
      <footer className="py-3 px-4 text-center text-neutral-500 text-xs">
        <p>TaskFlow © {new Date().getFullYear()} - A modern Kanban task manager</p>
      </footer>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default App;
