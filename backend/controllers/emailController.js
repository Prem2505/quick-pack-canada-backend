import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
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

    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'pprem4324@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
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
      message: 'Failed to send email. Please try again later.' 
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

    const transporter = createTransporter();

    // Build order details HTML
    let orderDetailsHTML = '';
    if (orderType === 'custom') {
      // Custom order with multiple items
      orderDetailsHTML = `
        <h3>Order Items:</h3>
        <ul>
          ${productDetails.map(item => `<li>${item.quantity}x ${item.size}${item.dimensions ? ` (${item.dimensions})` : ''}</li>`).join('')}
        </ul>
        <p><strong>Total Quantity:</strong> ${quantity}</p>
      `;
    } else {
      // Single item order
      orderDetailsHTML = `
        <p><strong>Product:</strong> ${productDetails.size} ${productDetails.type === 'pizza-box' ? 'Pizza Box' : 'Paper Cup'}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        ${productDetails.dimensions ? `<p><strong>Dimensions:</strong> ${productDetails.dimensions}</p>` : ''}
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'pprem4324@gmail.com',
      subject: `New Order from ${name} - ${orderType === 'custom' ? 'Custom Order' : productDetails.size}`,
      html: `
        <h2>New Order Received</h2>
        <h3>Order Type: ${orderType === 'custom' ? 'Custom Order (Multiple Sizes)' : 'Single Item Order'}</h3>
        
        ${orderDetailsHTML}
        
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
        <h3>Delivery Address:</h3>
        <p>${address}<br>
        ${city}, ${province} ${postalCode}</p>
        
        ${additionalNotes ? `<h3>Additional Notes:</h3><p>${additionalNotes.replace(/\n/g, '<br>')}</p>` : ''}
        
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
      message: 'Failed to submit order. Please try again later.' 
    });
  }
};

