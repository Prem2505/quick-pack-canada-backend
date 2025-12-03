import nodemailer from 'nodemailer';

/**
 * Creates and returns a nodemailer transporter for sending emails
 * Tries multiple SMTP configurations for better reliability
 * @returns {Object} Nodemailer transporter instance
 * @throws {Error} If EMAIL_USER or EMAIL_PASS are not set
 */
export const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in environment variables');
  }
  
  // Try port 465 (SSL) first, as it's more reliable on cloud platforms
  // If that doesn't work, fallback to port 587 (TLS)
  const useSSL = process.env.EMAIL_USE_SSL !== 'false'; // Default to SSL
  
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: useSSL ? 465 : 587,
    secure: useSSL, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Extended timeout settings for cloud platforms
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 20000, // 20 seconds
    socketTimeout: 20000, // 20 seconds
    // Retry configuration
    pool: true,
    maxConnections: 1,
    maxMessages: 5,
    // Additional options for reliability
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates if needed
      minVersion: 'TLSv1.2'
    },
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  });
};

/**
 * Sends email with retry logic
 * @param {Object} transporter - Nodemailer transporter
 * @param {Object} mailOptions - Email options
 * @param {number} maxRetries - Maximum number of retries (default: 2)
 * @returns {Promise} Send result
 */
export const sendEmailWithRetry = async (transporter, mailOptions, maxRetries = 2) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying email send (attempt ${attempt + 1}/${maxRetries + 1})...`);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
      
      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Email send attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry on authentication errors
      if (error.code === 'EAUTH' || error.responseCode === 535) {
        throw error;
      }
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  throw lastError;
};

