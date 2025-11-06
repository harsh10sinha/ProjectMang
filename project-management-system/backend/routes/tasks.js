const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks for a project
router.get('/project/:projectId', taskController.getTasksByProject);

// Get a single task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Move task to a different column/status
router.patch('/:id/move', taskController.moveTask);

module.exports = router;