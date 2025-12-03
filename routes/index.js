import express from 'express';
import contactRoutes from './contactRoutes.js';
import orderRoutes from './orderRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Mount route handlers
router.use('/contact', contactRoutes);
router.use('/order', orderRoutes);
router.use('/health', healthRoutes);

// Debug route to verify routes are loaded
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API routes are working',
    availableRoutes: [
      'GET /api/health',
      'GET /api/contact',
      'POST /api/contact',
      'GET /api/order',
      'POST /api/order'
    ]
  });
});

export default router;

