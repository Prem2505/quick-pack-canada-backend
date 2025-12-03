import express from 'express';
import { sendOrderEmail } from '../controllers/orderController.js';

const router = express.Router();

/**
 * @route   GET /api/order
 * @route   POST /api/order
 * @desc    Send order email
 * @access  Public
 */
router.get('/', sendOrderEmail);
router.post('/', sendOrderEmail);

export default router;

