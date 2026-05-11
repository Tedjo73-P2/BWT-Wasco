const { Pool } = require('pg');
require('dotenv').config();

const corePool = new Pool({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cknqkuvswhduuxoxphwn',
  password: 'bwtwasco@superbase',
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    console.log('Testing connection to Supabase...');
    const res = await corePool.query('SELECT c.full_name, u.email FROM customers c JOIN users u ON c.user_id = u.id');
    console.log('Customers in DB:', res.rows.length);
    res.rows.forEach(c => console.log(`- ${c.full_name} (${c.email})`));
  } catch (err) {
    console.error('Connection failed!', err.message);
  } finally {
    await corePool.end();
  }
}

test();
