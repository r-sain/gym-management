const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Gym Management API is running' });
});

// API Routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, data: null, message: err.message || 'Internal Server Error' });
});

module.exports = app;
