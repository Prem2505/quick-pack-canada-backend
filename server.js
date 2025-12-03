import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendContactEmail, sendOrderEmail } from './controllers/emailController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Support both POST (JSON body) and GET (URL parameters)
app.post('/api/contact', sendContactEmail);
app.get('/api/contact', sendContactEmail);
app.post('/api/order', sendOrderEmail);
app.get('/api/order', sendOrderEmail);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

