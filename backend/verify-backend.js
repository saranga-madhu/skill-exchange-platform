const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testBackend() {
    try {
        console.log('Testing Backend...');

        // 1. Register
        const email = `test${Date.now()}@example.com`;
        console.log(`\n1. Registering user ${email}...`);
        let res = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email: email,
            password: 'password123'
        });
        console.log('✅ Register Success:', res.data.id);
        const token = res.data.token;
        const userId = res.data.id;

        // 2. Login
        console.log('\n2. Logging in...');
        res = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: 'password123'
        });
        console.log('✅ Login Success:', res.data.token ? 'Token received' : 'No token');

        // 3. Create Skill
        console.log('\n3. Creating Skill...');
        res = await axios.post(`${API_URL}/skills`, {
            name: 'Test Skill',
            category: 'IT',
            description: 'A test skill',
            type: 'offered'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Create Skill Success:', res.data.id);

        // 4. Get Skills
        console.log('\n4. Getting Skills...');
        res = await axios.get(`${API_URL}/skills`);
        console.log('✅ Get Skills Success. Count:', res.data.length);

        console.log('\nAll backend tests passed! 🚀');

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
}

testBackend();
