require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Start server first so Render health checks pass immediately
    server.listen(PORT, '0.0.0.0', async () => {
      console.log(`Server running on port ${PORT}`);
      
      // Connect to database after listening
      await connectDB();
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
