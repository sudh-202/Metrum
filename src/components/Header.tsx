import React from 'react';
import SearchBar from './SearchBar';
import { Priority } from '../types';
import useTaskStore from '../hooks/useTaskStore';

// Updated Logo with gradient from your color palette
const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="taskflow-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF3132" />
        <stop offset="20%" stopColor="#FE005F" />
        <stop offset="40%" stopColor="#EE0089" />
        <stop offset="60%" stopColor="#CC28AF" />
        <stop offset="80%" stopColor="#9948CB" />
        <stop offset="100%" stopColor="#465CDA" />
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#taskflow-gradient)" />
    <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface HeaderProps {
  onAddTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
  const { searchTerm, priorityFilter, setSearchTerm, setPriorityFilter } = useTaskStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Logo />
            <div className="ml-3">
              <h1 className="text-2xl font-semibold uppercase  text-black flex items-center">
                TaskFlow
                <span className="ml-2 text-xs bg-[#FBE7FA] text-[#CC28AF] px-2 py-1 rounded-full font-medium">v1.0</span>
              </h1>
              <p className="text-sm text-neutral-500">A modern Kanban task manager</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl md:mt-0 mt-4 w-full">
            <SearchBar
              searchTerm={searchTerm}
              priorityFilter={priorityFilter}
              onSearchChange={setSearchTerm}
              onPriorityChange={setPriorityFilter}
            />
          </div>

          {/* Add Task Button with color palette */}
          <button
            onClick={onAddTask}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#3946B8] hover:bg-[#202d9c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9948CB] transition-colors duration-200 md:mt-0 mt-4 w-full md:w-auto justify-center md:justify-start"
            aria-label="Add new task"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Task
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
