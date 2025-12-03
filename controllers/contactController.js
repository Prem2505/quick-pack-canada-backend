import { createTransporter } from '../utils/emailUtils.js';
import { escapeHtml } from '../utils/helpers.js';
import { isValidEmail, validateRequiredFields } from '../utils/validation.js';
import { getRequestData } from '../utils/helpers.js';

/**
 * Send contact form email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendContactEmail = async (req, res) => {
  try {
    const data = getRequestData(req);
    const { name, email, phone, message } = data;

    // Validate required fields
    const validation = validateRequiredFields(data, ['name', 'email', 'message']);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: `${validation.missingFields.join(', ')} are required` 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    const transporter = createTransporter();

    // Escape HTML to prevent injection and breakage
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : 'Not provided';
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'pprem4324@gmail.com',
      subject: `New Contact Form Submission from ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
        <hr>
        <p><small>This email was sent from the Quick Pack Canada contact form.</small></p>
      `,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message === 'EMAIL_USER and EMAIL_PASS must be set in environment variables' 
        ? 'Server configuration error. Please contact administrator.' 
        : 'Failed to send email. Please try again later.' 
    });
  }
};

