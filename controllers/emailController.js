import nodemailer from 'nodemailer';

// Helper function to escape HTML
const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Create transporter
const createTransporter = () => {
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

// Send contact form email
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

    res.json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message === 'EMAIL_USER and EMAIL_PASS must be set in environment variables' 
        ? 'Server configuration error. Please contact administrator.' 
        : 'Failed to send email. Please try again later.' 
    });
  }
};

// Send order email
export const sendOrderEmail = async (req, res) => {
  try {
    const { 
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
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !province || !postalCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be filled' 
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

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    const transporter = createTransporter();

    // Build order details HTML with proper escaping
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

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Order submitted successfully! We will contact you soon.' 
    });
  } catch (error) {
    console.error('Error sending order email:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message === 'EMAIL_USER and EMAIL_PASS must be set in environment variables' 
        ? 'Server configuration error. Please contact administrator.' 
        : 'Failed to submit order. Please try again later.' 
    });
  }
};

