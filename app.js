require('dotenv').config();
const express = require('express');
const path = require('path');
const assignmentRoutes = require('./src/routes/assignments');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static front-end files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/assignments', assignmentRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
});