require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-helpdesk';

// Middleware
app.use(cors(
  {
    origin:["https://minihelpdesksite.netlify.app/tickets"]
  }
));
app.use(express.json());

// Routes
app.use('/api', routes);

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
