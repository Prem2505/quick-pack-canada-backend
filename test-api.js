// Simple test script for API endpoints
// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('=== Testing Quick Pack Canada API ===\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('   ✓ Health Check:', JSON.stringify(healthData, null, 2));
    console.log('   Status:', healthResponse.status);
  } catch (error) {
    console.log('   ✗ Health Check failed:', error.message);
  }

  // Test 2: Contact API (GET with URL parameters)
  try {
    console.log('\n2. Testing Contact API (GET with URL parameters)...');
    const contactUrl = `${BASE_URL}/api/contact?name=Test%20User&email=test@example.com&message=Hello%20from%20URL`;
    const contactResponse = await fetch(contactUrl);
    const contactData = await contactResponse.json();
    console.log('   Status:', contactResponse.status);
    console.log('   Response:', JSON.stringify(contactData, null, 2));
  } catch (error) {
    console.log('   ✗ Contact API (GET) failed:', error.message);
  }

  // Test 3: Contact API (POST with JSON body)
  try {
    console.log('\n3. Testing Contact API (POST with JSON body)...');
    const postResponse = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '204-555-0123',
        message: 'This is a test message from POST request'
      })
    });
    const postData = await postResponse.json();
    console.log('   Status:', postResponse.status);
    console.log('   Response:', JSON.stringify(postData, null, 2));
  } catch (error) {
    console.log('   ✗ Contact API (POST) failed:', error.message);
  }

  // Test 4: Order API (GET with URL parameters - simple)
  try {
    console.log('\n4. Testing Order API (GET with URL parameters)...');
    // For GET requests, we need to pass productDetails as JSON string or use individual params
    const productDetails = JSON.stringify({ size: 'Large', type: 'pizza-box', dimensions: '12x12x1.75' });
    const orderUrl = `${BASE_URL}/api/order?name=Jane%20Smith&email=jane@example.com&phone=204-555-0456&address=123%20Main%20St&city=Winnipeg&province=MB&postalCode=R3B1A1&orderType=single&productDetails=${encodeURIComponent(productDetails)}&quantity=10`;
    const orderResponse = await fetch(orderUrl);
    const orderData = await orderResponse.json();
    console.log('   Status:', orderResponse.status);
    console.log('   Response:', JSON.stringify(orderData, null, 2));
  } catch (error) {
    console.log('   ✗ Order API (GET) failed:', error.message);
  }

  // Test 5: Order API (POST with JSON body)
  try {
    console.log('\n5. Testing Order API (POST with JSON body)...');
    const postOrderResponse = await fetch(`${BASE_URL}/api/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderType: 'single',
        productDetails: {
          size: 'Medium',
          type: 'pizza-box',
          dimensions: '10x10x1.5'
        },
        quantity: '20',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '204-555-0789',
        address: '456 Oak Avenue',
        city: 'Winnipeg',
        province: 'MB',
        postalCode: 'R3C 2D2',
        additionalNotes: 'Please deliver before 5 PM'
      })
    });
    const postOrderData = await postOrderResponse.json();
    console.log('   Status:', postOrderResponse.status);
    console.log('   Response:', JSON.stringify(postOrderData, null, 2));
  } catch (error) {
    console.log('   ✗ Order API (POST) failed:', error.message);
  }

  console.log('\n=== Testing Complete ===');
  console.log('\nNote: If you see email configuration errors, make sure your .env file has EMAIL_USER and EMAIL_PASS set.');
}

testAPI().catch(console.error);

