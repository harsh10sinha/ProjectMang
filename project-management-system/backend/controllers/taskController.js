const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        console.log('Create task request body:', req.body);
        const { title, description, status, projectId } = req.body;

        // Validate required fields
        if (!title || !description || !projectId) {
            console.log('Validation failed: missing required fields');
            return res.status(400).json({ message: 'Title, description, and projectId are required' });
        }

        // Validate status if provided
        if (status && !['todo', 'inProgress', 'done'].includes(status)) {
            console.log('Validation failed: invalid status');
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const task = new Task({
            title,
            description,
            status: status || 'todo',
            projectId
        });
        await task.save();
        console.log('Task created successfully:', task);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks for a project
exports.getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        console.log('Update task request params:', req.params);
        console.log('Update task request body:', req.body);

        // Only update the fields that are provided
        const updateFields = {};
        if (req.body.title !== undefined) updateFields.title = req.body.title;
        if (req.body.description !== undefined) updateFields.description = req.body.description;
        if (req.body.status !== undefined) updateFields.status = req.body.status;

        // Add updatedAt timestamp
        updateFields.updatedAt = Date.now();

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );
        if (!task) {
            console.log('Task not found for update');
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log('Task updated successfully:', task);
        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Move task to a different column/status
exports.moveTask = async (req, res) => {
    try {
        console.log('Move task request params:', req.params);
        console.log('Move task request body:', req.body);
        const { status } = req.body;

        // Validate status
        if (!['todo', 'inProgress', 'done'].includes(status)) {
            console.log('Validation failed: invalid status for move');
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!task) {
            console.log('Task not found for move');
            return res.status(404).json({ message: 'Task not found' });
        }
        console.log('Task moved successfully:', task);
        res.status(200).json(task);
    } catch (error) {
        console.error('Error moving task:', error);
        res.status(400).json({ message: error.message });
    }
};