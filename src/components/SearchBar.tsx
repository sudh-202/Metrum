import React from 'react';
import { Priority } from '../types';

interface SearchBarProps {
  searchTerm: string;
  priorityFilter: Priority | null;
  onSearchChange: (term: string) => void;
  onPriorityChange: (priority: Priority | null) => void;
}

/**
 * SearchBar component for filtering tasks
 */
const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  priorityFilter,
  onSearchChange,
  onPriorityChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 w-full">
      <div className="relative flex-grow group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors duration-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-lg leading-5 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all duration-200 shadow-sm"
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="w-full md:w-48">
        <select
          value={priorityFilter || ''}
          onChange={(e) => {
            const value = e.target.value;
            onPriorityChange(value ? (value as Priority) : null);
          }}
          className="block w-full pl-3 pr-10 py-2 text-sm border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-lg shadow-sm bg-white transition-all duration-200"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value={Priority.LOW}>Low Priority</option>
          <option value={Priority.MEDIUM}>Medium Priority</option>
          <option value={Priority.HIGH}>High Priority</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;