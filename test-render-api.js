// Test script for Render deployment
// Update the BASE_URL with your Render URL

const BASE_URL = 'https://quick-pack-canada-backend-1.onrender.com';

async function testRenderAPI() {
  console.log('=== Testing Quick Pack Canada API on Render ===\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test 1: Root endpoint
  try {
    console.log('1. Testing Root Endpoint (/)...');
    const rootResponse = await fetch(`${BASE_URL}/`);
    const rootData = await rootResponse.json();
    console.log('   ✓ Root:', JSON.stringify(rootData, null, 2));
    console.log('   Status:', rootResponse.status);
  } catch (error) {
    console.log('   ✗ Root endpoint failed:', error.message);
  }

  // Test 2: API Info endpoint
  try {
    console.log('\n2. Testing API Info Endpoint (/api)...');
    const apiResponse = await fetch(`${BASE_URL}/api`);
    const apiData = await apiResponse.json();
    console.log('   ✓ API Info:', JSON.stringify(apiData, null, 2));
    console.log('   Status:', apiResponse.status);
  } catch (error) {
    console.log('   ✗ API info endpoint failed:', error.message);
  }

  // Test 3: Health Check
  try {
    console.log('\n3. Testing Health Check (/api/health)...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('   ✓ Health Check:', JSON.stringify(healthData, null, 2));
    console.log('   Status:', healthResponse.status);
  } catch (error) {
    console.log('   ✗ Health check failed:', error.message);
  }

  // Test 4: Contact API (GET with URL parameters)
  try {
    console.log('\n4. Testing Contact API (GET with URL parameters)...');
    const contactUrl = `${BASE_URL}/api/contact?name=Test%20User&email=test@example.com&message=Hello%20from%20Render%20test`;
    const contactResponse = await fetch(contactUrl);
    const contactData = await contactResponse.json();
    console.log('   Status:', contactResponse.status);
    console.log('   Response:', JSON.stringify(contactData, null, 2));
  } catch (error) {
    console.log('   ✗ Contact API (GET) failed:', error.message);
  }

  // Test 5: Contact API (POST with JSON body)
  try {
    console.log('\n5. Testing Contact API (POST with JSON body)...');
    const postResponse = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '204-555-0123',
        message: 'This is a test message from Render deployment'
      })
    });
    const postData = await postResponse.json();
    console.log('   Status:', postResponse.status);
    console.log('   Response:', JSON.stringify(postData, null, 2));
  } catch (error) {
    console.log('   ✗ Contact API (POST) failed:', error.message);
  }

  // Test 6: Order API (GET with URL parameters)
  try {
    console.log('\n6. Testing Order API (GET with URL parameters)...');
    const productDetails = JSON.stringify({ size: 'Large', type: 'pizza-box', dimensions: '12x12x1.75' });
    const orderUrl = `${BASE_URL}/api/order?name=Jane%20Smith&email=jane@example.com&phone=204-555-0456&address=123%20Main%20St&city=Winnipeg&province=MB&postalCode=R3B1A1&orderType=single&productDetails=${encodeURIComponent(productDetails)}&quantity=10`;
    const orderResponse = await fetch(orderUrl);
    const orderData = await orderResponse.json();
    console.log('   Status:', orderResponse.status);
    console.log('   Response:', JSON.stringify(orderData, null, 2));
  } catch (error) {
    console.log('   ✗ Order API (GET) failed:', error.message);
  }

  // Test 7: Order API (POST with JSON body)
  try {
    console.log('\n7. Testing Order API (POST with JSON body)...');
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
  console.log('\nNote: If you see email connection timeout errors, check the RENDER_DEPLOYMENT.md guide for solutions.');
}

testRenderAPI().catch(console.error);


