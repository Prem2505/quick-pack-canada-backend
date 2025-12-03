import express from 'express';
import contactRoutes from './contactRoutes.js';
import orderRoutes from './orderRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Mount route handlers
router.use('/contact', contactRoutes);
router.use('/order', orderRoutes);
router.use('/health', healthRoutes);

export default router;

