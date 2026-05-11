const axios = require('axios');

async function testLogin() {
  try {
    console.log('Attempting login...');
    const res = await axios.post('https://bwt-wasco-backend.onrender.com/api/auth/login', {
      email: 'Admin@bwtwasco.com',
      password: '1234'
    });
    console.log('Login successful!', res.data);
  } catch (err) {
    console.error('Login failed!', err.response?.data || err.message);
  }
}

testLogin();
