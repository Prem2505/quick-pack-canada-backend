import express from 'express';
import { sendContactEmail } from '../controllers/contactController.js';

const router = express.Router();

/**
 * @route   GET /api/contact
 * @route   POST /api/contact
 * @desc    Send contact form email
 * @access  Public
 */
router.get('/', sendContactEmail);
router.post('/', sendContactEmail);

export default router;

