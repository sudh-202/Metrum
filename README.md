# TaskFlow - A Modern Kanban Task Manager

![TaskFlow](https://img.shields.io/badge/TaskFlow-Kanban%20Board-blue)

TaskFlow is a modern Kanban-style task management application built with React and TypeScript. It allows users to organize tasks in a visual board with drag-and-drop functionality.

## Features

- **Kanban Board Layout**: Organize tasks in To Do, In Progress, and Done columns
- **Drag and Drop**: Easily move tasks between columns
- **Task Management**: Create, edit, and delete tasks
- **Priority Levels**: Assign Low, Medium, or High priority to tasks
- **Search & Filter**: Find tasks quickly with search and priority filtering
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Tasks persist between browser sessions

## Tech Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- React DnD Kit for drag and drop functionality
- Zustand for state management
- Local Storage for data persistence

## Project Structure

```
src/
├── components/     # UI components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── data/           # Initial data and constants
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Add a Task**: Click the "Add Task" button in the header
- **Edit a Task**: Click the edit icon on any task card
- **Delete a Task**: Click the delete icon on any task card
- **Move a Task**: Drag and drop tasks between columns
- **Search Tasks**: Use the search bar to filter tasks by title or description
- **Filter by Priority**: Use the dropdown to filter tasks by priority level

## Development Phases

The project was developed in the following phases:

1. **Planning & Setup**: Project initialization and folder structure
2. **Core Layout**: Basic Kanban board layout with columns
3. **Task Card Component**: Task display with priority indicators
4. **Task Management**: Add, edit, and delete functionality
5. **Drag & Drop**: Moving tasks between columns
6. **Search & Filter**: Finding and filtering tasks
7. **Polish & UX**: Improved user experience and responsive design

## License

MIT
