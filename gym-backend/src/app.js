const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://gym-management-opnz.onrender.com', // render frontend (if any)
    'https://gym-management-flame-eta.vercel.app', // vercel frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Gym Management API is running' });
});

// Ping route for waking up Render service
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
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
