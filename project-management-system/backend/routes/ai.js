// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Summarize all tasks in a project
// GET /api/ai/summarize/:projectId
router.get('/summarize/:projectId', aiController.summarizeProject);

// Answer questions about a specific task (or project id)
// POST /api/ai/question/:taskId
// body: { question: "What is pending?" }
router.post('/question/:taskId', aiController.answerQuestion);

module.exports = router;
