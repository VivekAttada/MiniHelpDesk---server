require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-helpdesk';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (must come before static serving)
app.use('/api', routes);

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '..', 'static')));

// Handle React routing - send all non-API requests to index.html
// In Express v5, use a function that checks if it's not an API route
app.use((req, res, next) => {
  // If the request is for an API route, skip this middleware
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Otherwise, serve the React app
  res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB(MONGODB_URI);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
