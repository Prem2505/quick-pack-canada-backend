/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
export const escapeHtml = (text) => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Gets data from request body or query parameters
 * Prioritizes body (POST) over query (GET)
 * @param {Object} req - Express request object
 * @returns {Object} Request data
 */
export const getRequestData = (req) => {
  return Object.keys(req.body || {}).length > 0 ? req.body : req.query;
};

/**
 * Parses productDetails from string (URL parameter) or returns object
 * @param {string|Object} productDetails - Product details as string or object
 * @param {Object} fallbackData - Fallback data if parsing fails
 * @returns {Object} Parsed product details object
 */
export const parseProductDetails = (productDetails, fallbackData = {}) => {
  if (typeof productDetails === 'string') {
    try {
      return JSON.parse(productDetails);
    } catch (e) {
      // If parsing fails, try to construct from individual parameters
      if (fallbackData.productSize) {
        return {
          size: fallbackData.productSize,
          type: fallbackData.productType || 'pizza-box',
          dimensions: fallbackData.dimensions || null
        };
      }
      throw new Error('Invalid productDetails format');
    }
  }
  return productDetails;
};

