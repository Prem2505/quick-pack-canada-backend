import nodemailer from 'nodemailer';

/**
 * Creates and returns a nodemailer transporter for sending emails
 * Supports SendGrid (recommended for cloud) and Gmail as fallback
 * @returns {Object} Nodemailer transporter instance
 * @throws {Error} If no email credentials are set
 */
export const createTransporter = () => {
  // Priority 1: Use SendGrid if API key is provided (recommended for cloud platforms)
  if (process.env.SENDGRID_API_KEY) {
    console.log('Using SendGrid for email delivery');
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }
  
  // Priority 2: Use Gmail if credentials are provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('Using Gmail for email delivery');
    const useSSL = process.env.EMAIL_USE_SSL !== 'false'; // Default to SSL
    
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: useSSL ? 465 : 587,
      secure: useSSL,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      pool: true,
      maxConnections: 1,
      maxMessages: 5,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });
  }
  
  throw new Error('No email service configured. Please set SENDGRID_API_KEY or EMAIL_USER and EMAIL_PASS in environment variables');
};

/**
 * Sends email with retry logic and automatic fallback
 * @param {Object} transporter - Nodemailer transporter
 * @param {Object} mailOptions - Email options
 * @param {number} maxRetries - Maximum number of retries (default: 1 for SendGrid, 2 for Gmail)
 * @returns {Promise} Send result
 */
export const sendEmailWithRetry = async (transporter, mailOptions, maxRetries = null) => {
  // SendGrid is more reliable, fewer retries needed
  // Gmail may need more retries due to connection issues
  const retries = maxRetries !== null ? maxRetries : (process.env.SENDGRID_API_KEY ? 1 : 2);
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying email send (attempt ${attempt + 1}/${retries + 1})...`);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
      
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Email send attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry on authentication errors
      if (error.code === 'EAUTH' || error.responseCode === 535) {
        throw error;
      }
      
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }
    }
  }
  
  throw lastError;
};

