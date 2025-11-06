# Project & Task Management System with AI Integration

A full-stack MERN application with AI-powered features using Gemini AI for task summarization and Q&A.

## Features

- Project Management (Create, Read, Update, Delete)
- Task Management within projects
- Kanban Board Interface (Trello-like)
- Drag and drop functionality
- AI Features (Gemini Integration)
  - Summarize all tasks in a project
  - Question & Answer about specific tasks
- Responsive UI
- Data persistence with MongoDB

## Tech Stack

- **Frontend**: React.js, React Router, Axios, @dnd-kit (for drag and drop)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI Integration**: Google's Gemini API
- **Development Tools**: Vite, Nodemon

## Project Structure

```
project-management-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       └── App.js
├── package.json (root)
├── .env
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API Key

### Backend Setup

1. Navigate to the project root directory:
   ```
   cd project-management-system
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/projectmanagement
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

## API Endpoints

### Project Endpoints
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Task Endpoints
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/project/:projectId` - Get all tasks for a project
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/move` - Move a task to a different column

### AI Endpoints
- `GET /api/ai/summarize/:projectId` - Summarize all tasks in a project
- `POST /api/ai/question/:taskId` - Ask a question about a specific task

## Development

### Available Scripts

In the project root directory:

- `npm run dev` - Start the backend server with nodemon for development
- `npm start` - Start the backend server

In the frontend directory:

- `npm start` - Start the frontend development server
- `npm run build` - Build the app for production
- `npm test` - Run tests

## Future Improvements

- Implement real Gemini AI integration
- Add user authentication and authorization
- Implement real-time updates with WebSockets
- Add file attachments to tasks
- Implement task comments and collaboration features
- Add due dates and reminders
- Implement task filtering and search
- Add project and task analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.