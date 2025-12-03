import { createTransporter, sendEmailWithRetry } from '../utils/emailUtils.js';
import { escapeHtml, parseProductDetails } from '../utils/helpers.js';
import { isValidEmail, validateRequiredFields } from '../utils/validation.js';
import { getRequestData } from '../utils/helpers.js';

/**
 * Send order email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendOrderEmail = async (req, res) => {
  try {
    const data = getRequestData(req);
    let { 
      orderType,
      productDetails,
      quantity,
      name,
      email,
      phone,
      address,
      city,
      province,
      postalCode,
      additionalNotes
    } = data;

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'province', 'postalCode'];
    const validation = validateRequiredFields(data, requiredFields);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be filled' 
      });
    }

    // Parse productDetails if it comes as a string from URL (GET request)
    try {
      productDetails = parseProductDetails(productDetails, data);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product details format' 
      });
    }

    // Validate productDetails based on orderType
    if (!productDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product details are required' 
      });
    }

    if (orderType === 'custom') {
      // For custom orders, productDetails should be an array
      if (!Array.isArray(productDetails) || productDetails.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Custom orders require an array of product details' 
        });
      }
    } else {
      // For single orders, productDetails should be an object with size
      if (!productDetails.size) {
        return res.status(400).json({ 
          success: false, 
          message: 'Product size is required for single item orders' 
        });
      }
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    const transporter = createTransporter();

    // Build order details HTML with proper escaping
    const { orderDetailsHTML, orderSubject } = buildOrderDetailsHTML(orderType, productDetails, quantity);

    // Escape all user input
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeAddress = escapeHtml(address);
    const safeCity = escapeHtml(city);
    const safeProvince = escapeHtml(province);
    const safePostalCode = escapeHtml(postalCode);
    const safeAdditionalNotes = additionalNotes 
      ? escapeHtml(additionalNotes).replace(/\n/g, '<br>') 
      : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'pprem4324@gmail.com',
      subject: `New Order from ${safeName} - ${orderSubject}`,
      html: `
        <h2>New Order Received</h2>
        <h3>Order Type: ${orderType === 'custom' ? 'Custom Order (Multiple Sizes)' : 'Single Item Order'}</h3>
        
        ${orderDetailsHTML}
        
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        
        <h3>Delivery Address:</h3>
        <p>${safeAddress}<br>
        ${safeCity}, ${safeProvince} ${safePostalCode}</p>
        
        ${safeAdditionalNotes ? `<h3>Additional Notes:</h3><p>${safeAdditionalNotes}</p>` : ''}
        
        <hr>
        <p><small>This email was sent from the Quick Pack Canada order form.</small></p>
      `,
      replyTo: email
    };

    // Use retry logic for better reliability
    await sendEmailWithRetry(transporter, mailOptions, 2);

    res.status(200).json({ 
      success: true, 
      message: 'Order submitted successfully! We will contact you soon.' 
    });
  } catch (error) {
    console.error('Error sending order email:', error);
    
    // Handle specific error types
    let errorMessage = 'Failed to submit order. Please try again later.';
    
    if (error.message === 'EMAIL_USER and EMAIL_PASS must be set in environment variables') {
      errorMessage = 'Server configuration error. Please contact administrator.';
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Email service connection timeout. Please try again later or contact support.';
      console.error('Connection error details:', {
        code: error.code,
        command: error.command,
        message: error.message
      });
    } else if (error.responseCode) {
      errorMessage = `Email service error: ${error.responseCode}. Please try again later.`;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage 
    });
  }
};

/**
 * Builds HTML for order details based on order type
 * @param {string} orderType - Type of order ('custom' or 'single')
 * @param {Object|Array} productDetails - Product details object or array
 * @param {string} quantity - Total quantity
 * @returns {Object} Object containing orderDetailsHTML and orderSubject
 */
const buildOrderDetailsHTML = (orderType, productDetails, quantity) => {
  const escapeHtml = (text) => {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  let orderDetailsHTML = '';
  let orderSubject = '';
  
  if (orderType === 'custom') {
    // Custom order with multiple items
    const itemsList = productDetails.map(item => {
      const itemQuantity = escapeHtml(item.quantity || 'N/A');
      const itemSize = escapeHtml(item.size || 'N/A');
      const itemDimensions = item.dimensions ? ` (${escapeHtml(item.dimensions)})` : '';
      return `<li>${itemQuantity}x ${itemSize}${itemDimensions}</li>`;
    }).join('');
    
    orderDetailsHTML = `
      <h3>Order Items:</h3>
      <ul>
        ${itemsList}
      </ul>
      <p><strong>Total Quantity:</strong> ${escapeHtml(quantity || 'N/A')}</p>
    `;
    orderSubject = 'Custom Order';
  } else {
    // Single item order
    const productSize = escapeHtml(productDetails.size || 'N/A');
    const productType = productDetails.type === 'pizza-box' ? 'Pizza Box' : 'Paper Cup';
    const productDimensions = productDetails.dimensions 
      ? `<p><strong>Dimensions:</strong> ${escapeHtml(productDetails.dimensions)}</p>` 
      : '';
    
    orderDetailsHTML = `
      <p><strong>Product:</strong> ${productSize} ${productType}</p>
      <p><strong>Quantity:</strong> ${escapeHtml(quantity || 'N/A')}</p>
      ${productDimensions}
    `;
    orderSubject = productSize;
  }

  return { orderDetailsHTML, orderSubject };
};

