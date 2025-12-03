import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Quick Pack Canada API is running',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact',
      order: '/api/order'
    }
  });
});

// API Routes
try {
  app.use('/api', routes);
  console.log('API routes mounted successfully');
} catch (error) {
  console.error('Error mounting routes:', error);
  // Fallback route if routes fail to load
  app.use('/api', (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Routes failed to load',
      error: error.message
    });
  });
}

// 404 Handler - must be after all routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error Handler - must be last
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

