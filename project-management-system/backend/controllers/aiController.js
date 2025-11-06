// AI controller with Google Gemini API integration
const Task = require('../models/Task');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Verify that the API key is set
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.GEMINI_API_KEY.length < 10) {
    console.warn('WARNING: GEMINI_API_KEY is not set or is invalid. AI features will not work properly.');
    // Set a flag to indicate API key is invalid
    global.INVALID_API_KEY = true;
} else {
    console.log('Gemini API key found, attempting to initialize...');
    global.INVALID_API_KEY = false;
}

// Log the API key (first 5 characters only for security)
if (process.env.GEMINI_API_KEY) {
    console.log('Using API key starting with:', process.env.GEMINI_API_KEY.substring(0, 5) + '...');
} else {
    console.log('No API key found in environment variables');
}

// Simple function to get a working model
function getSimpleModel() {
    try {
        // Use the model you specified
        return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch (error) {
        console.log("Failed to initialize gemini-2.5-flash, error:", error.message);
        try {
            // Fallback to the model we know works
            return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        } catch (fallbackError) {
            console.log("Failed to initialize gemini-1.5-flash, error:", fallbackError.message);
            // If all fails, we'll handle it in the calling function
            throw new Error("Unable to initialize any Gemini model");
        }
    }
}

// Summarize all tasks in a project
exports.summarizeProject = async (req, res) => {
    try {
        // Check if API key is valid
        if (global.INVALID_API_KEY) {
            return res.status(200).json({
                summary: 'AI features are currently disabled due to missing or invalid API key.',
                recommendations: [
                    'Please contact the system administrator to configure the Google Gemini API key.',
                    'Ensure the GEMINI_API_KEY is set in the environment variables.',
                    'Verify the API key has the necessary permissions.'
                ]
            });
        }

        const { projectId } = req.params;

        // Get all tasks for the project
        const tasks = await Task.find({ projectId });

        // Create a summary of the project tasks
        const taskCount = tasks.length;
        const todoTasks = tasks.filter(task => task.status === 'todo').length;
        const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
        const doneTasks = tasks.filter(task => task.status === 'done').length;

        // Try to get a working model
        let model;
        try {
            model = getSimpleModel();
        } catch (modelError) {
            console.error('Failed to initialize model:', modelError);
            // Return a mock response if model initialization fails
            return res.status(200).json({
                summary: `This project has ${taskCount} tasks: ${todoTasks} to do, ${inProgressTasks} in progress, and ${doneTasks} completed.`,
                recommendations: [
                    "Consider prioritizing tasks in the 'To Do' column",
                    "Review tasks in 'In Progress' to ensure they're moving forward",
                    "Celebrate completion of tasks in the 'Done' column"
                ]
            });
        }

        // Prepare the prompt for Gemini
        const prompt = `Project Analysis:
- Total tasks: ${taskCount}
- To Do: ${todoTasks}
- In Progress: ${inProgressTasks}
- Done: ${doneTasks}

Provide a brief professional summary of this project's status and 3 specific recommendations for improvement. Keep it concise and actionable.`;

        console.log('Sending prompt to Gemini API:', prompt);

        // Generate content with a simpler approach
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Received response from Gemini API:', text);

        // Create a structured response
        const geminiResponse = {
            summary: text || `This project has ${taskCount} tasks: ${todoTasks} to do, ${inProgressTasks} in progress, and ${doneTasks} completed.`,
            recommendations: [
                "Consider prioritizing tasks in the 'To Do' column",
                "Review tasks in 'In Progress' to ensure they're moving forward",
                "Celebrate completion of tasks in the 'Done' column"
            ]
        };

        res.status(200).json(geminiResponse);
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Return a fallback response instead of propagating error
        res.status(200).json({
            summary: 'The AI assistant is temporarily unavailable. Please try again later.',
            recommendations: [
                'Check your internet connection',
                'Verify your API key is valid',
                'Try again in a few minutes'
            ]
        });
    }
};

// Answer questions about a specific task or project
exports.answerQuestion = async (req, res) => {
    try {
        // Check if API key is valid
        if (global.INVALID_API_KEY) {
            return res.status(200).json({
                answer: 'AI features are currently disabled due to missing or invalid API key.',
                confidence: 0.0
            });
        }

        const { taskId } = req.params;
        const { question } = req.body;

        // Check if question is provided
        if (!question || question.trim().length === 0) {
            return res.status(200).json({
                answer: 'Please provide a question to get an AI-powered response.',
                confidence: 0.0
            });
        }

        // Check if taskId is actually a project ID by trying to find a task with that ID first
        let context = '';

        // Validate if taskId looks like a MongoDB ObjectId
        let task = null;
        if (taskId.match(/^[0-9a-fA-F]{24}$/)) {
            // It looks like an ObjectId, try to find a task with this ID
            task = await Task.findById(taskId);
        }

        if (task) {
            // It's a valid task ID
            context = `Task: "${task.title}" - ${task.description}`;
        } else {
            // It's likely a project ID or generic question
            context = `Project ID: ${taskId}`;
        }

        // Try to get a working model
        let model;
        try {
            model = getSimpleModel();
        } catch (modelError) {
            console.error('Failed to initialize model:', modelError);
            // Return a mock response if model initialization fails
            return res.status(200).json({
                answer: `I can help you with questions about ${context}. However, I'm currently unable to access the AI service. Please check your API configuration.`,
                confidence: 0.5
            });
        }

        // Prepare the prompt for Gemini
        const prompt = `Context: ${context}
Question: ${question}
Please provide a helpful and concise answer.`;

        console.log('Sending prompt to Gemini API:', prompt);

        // Generate content with a simpler approach
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Received response from Gemini API:', text);

        // Create a structured response
        const geminiResponse = {
            answer: text || 'I apologize, but I am unable to generate a response at this time.',
            confidence: 0.8
        };

        res.status(200).json(geminiResponse);
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Return a fallback response instead of propagating error
        res.status(200).json({
            answer: 'The AI assistant is temporarily unavailable. Please try again later.',
            confidence: 0.0
        });
    }
};