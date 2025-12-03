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
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

