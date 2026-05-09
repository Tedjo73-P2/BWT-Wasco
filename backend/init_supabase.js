const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'db.iriaheutgtekdkeydbik.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'superbase@wasco',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function init() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    const schemaPath = path.join(__dirname, '..', 'wasco_core_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema initialization...');
    await client.query(schema);
    console.log('Schema initialized successfully!');

    // Seed some initial districts if they don't exist
    const seedDistricts = [
      'Maseru', 'Leribe', 'Berea', 'Mafeteng', 'Mohale\'s Hoek', 
      'Quthing', 'Qacha\'s Nek', 'Mokhotlong', 'Butha-Buthe', 'Thaba-Tseka'
    ];
    
    for (const district of seedDistricts) {
      await client.query('INSERT INTO districts (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [district]);
    }
    console.log('Initial districts seeded.');

  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.end();
  }
}

init();
