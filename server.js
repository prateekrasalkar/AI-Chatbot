// server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config();

// Declare fetch variable
let fetch;

// Create an async function to initialize the app
async function initializeApp() {
    // Dynamically import node-fetch
    fetch = (await import('node-fetch')).default;

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware
    app.use(express.json()); // parse JSON request bodies
    app.use(express.static(path.join(__dirname, 'public'))); // serve files from /public

    // POST route to handle AI requests
    app.post('/api/generate', async (req, res) => {
        try {
            const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

            const response = await fetch(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            });

            const data = await response.json();
            res.json(data);
        } catch (err) {
            console.error('Error contacting Gemini API:', err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

// Call the async function to start the app
initializeApp().catch(err => {
    console.error('Failed to initialize app:', err);
    process.exit(1);
});