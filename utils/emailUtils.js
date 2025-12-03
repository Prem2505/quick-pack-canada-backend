import nodemailer from 'nodemailer';

/**
 * Creates and returns a nodemailer transporter for sending emails
 * @returns {Object} Nodemailer transporter instance
 * @throws {Error} If EMAIL_USER or EMAIL_PASS are not set
 */
export const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in environment variables');
  }
  
  // Use explicit SMTP configuration with timeout settings for better reliability
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Connection timeout settings
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
    // Retry configuration
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    // Additional options for reliability
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates if needed
    }
  });
};

