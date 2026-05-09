const bcrypt = require('bcryptjs');
const pgPool = require('./db/core');
const mysqlPool = require('./db/billing');

const seed = async () => {
  console.log('🚀 Starting Cloud Database Seeding...');
  
  try {
    const passwordHash = await bcrypt.hash('1234', 10);

    // 1. Seed Districts into PostgreSQL (Supabase)
    const districts = [
      'Maseru', 'Berea', 'Leribe', 'Butha-Buthe', 'Mokhotlong',
      'Thaba-Tseka', 'Qacha\'s Nek', 'Quthing', 'Mohale\'s Hoek', 'Mafeteng'
    ];
    
    console.log('📍 Seeding Districts into Supabase...');
    for (const d of districts) {
      await pgPool.query('INSERT INTO districts (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [d]);
    }

    // 2. Seed Admin and Manager into PostgreSQL (Supabase)
    console.log('👤 Seeding System Accounts...');
    
    // Admin
    const adminRes = await pgPool.query('SELECT id FROM users WHERE email = $1', ['admin@bwtwasco.com']);
    if (adminRes.rows.length === 0) {
      const user = await pgPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
        ['admin@bwtwasco.com', passwordHash, 'admin']
      );
      // Get district ID for Maseru
      const dRes = await pgPool.query('SELECT district_id FROM districts WHERE name = $1', ['Maseru']);
      await pgPool.query(
        'INSERT INTO customers (account_number, user_id, full_name, district_id) VALUES ($1, $2, $3, $4)',
        ['ADM-001', user.rows[0].id, 'Tedjo73', dRes.rows[0].district_id]
      );
    }

    // Manager
    const managerRes = await pgPool.query('SELECT id FROM users WHERE email = $1', ['manager@bwtwasco.com']);
    if (managerRes.rows.length === 0) {
      const user = await pgPool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
        ['manager@bwtwasco.com', passwordHash, 'manager']
      );
      const dRes = await pgPool.query('SELECT district_id FROM districts WHERE name = $1', ['Maseru']);
      await pgPool.query(
        'INSERT INTO customers (account_number, user_id, full_name, district_id) VALUES ($1, $2, $3, $4)',
        ['MGR-001', user.rows[0].id, 'Universal Manager', dRes.rows[0].district_id]
      );
    }

    // 3. Seed Group Members as Customers (Supabase)
    const members = [
      { name: 'Liteboho Mafatlane', email: 'liteboho@bwtwasco.com', acc: 'ACC-10001' },
      { name: 'Lineo Makaja', email: 'lineo@bwtwasco.com', acc: 'ACC-10002' },
      { name: 'Tobatsi Mabula', email: 'tobatsi@bwtwasco.com', acc: 'ACC-10003' },
      { name: 'Nthatuoa Ntsebeng', email: 'nthatuoa@bwtwasco.com', acc: 'ACC-10004' },
      { name: 'Reatile', email: 'reatile@bwtwasco.com', acc: 'ACC-10005' }
    ];

    console.log('👥 Seeding Group Member Accounts...');
    for (const m of members) {
      const exists = await pgPool.query('SELECT id FROM users WHERE email = $1', [m.email]);
      if (exists.rows.length === 0) {
        const user = await pgPool.query(
          'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
          [m.email, passwordHash, 'customer']
        );
        const distName = districts[members.indexOf(m)];
        const dRes = await pgPool.query('SELECT district_id FROM districts WHERE name = $1', [distName]);
        await pgPool.query(
          'INSERT INTO customers (account_number, user_id, full_name, phone_number, district_id) VALUES ($1, $2, $3, $4, $5)',
          [m.acc, user.rows[0].id, m.name, '+266 5000000' + members.indexOf(m), dRes.rows[0].district_id]
        );
      }
    }

    // 4. Seed Historical Billing Data into MySQL (Railway)
    console.log('💰 Seeding Historical Billing & Payment Telemetry...');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const allCustomers = [...members.map(m => m.acc), 'ADM-001'];

    for (const acc of allCustomers) {
      for (let i = 0; i < 12; i++) {
        const monthIdx = i;
        const month = months[monthIdx];
        const usage = 5 + Math.random() * 25; // 5-30 kL
        const amount = usage * 12.5; // Rough estimate
        const status = Math.random() > 0.3 ? 'Paid' : 'Unpaid';
        const dueDate = `${currentYear}-${(monthIdx + 1).toString().padStart(2, '0')}-28`;

        const billRes = await mysqlPool.query(
          `INSERT INTO bills (account_number, month, year, meter_reading_previous, meter_reading_current, usage_m3, amount_due, status, due_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
          [acc, month, currentYear, i * 30, (i * 30) + usage, usage, amount, status, dueDate]
        );

        if (status === 'Paid') {
          const insertedBill = billRes.rows[0];
          await mysqlPool.query(
            `INSERT INTO payments (bill_id, account_number, amount_paid, payment_method, reference_number)
             VALUES (?, ?, ?, ?, ?)`,
            [insertedBill.bill_id, acc, amount, 'Bank Transfer', `SEED-${acc}-${month}-${currentYear}`]
          );
        }
      }
    }

    // 5. Seed Billing Rates into MySQL (Railway)
    console.log('📈 Seeding Final Billing Tiers...');
    await mysqlPool.query('INSERT IGNORE INTO billing_rates (tier_name, cost_per_m3, min_usage_m3, max_usage_m3, effective_date) VALUES (?, ?, ?, ?, ?)', ['Lifeline', 5.50, 0, 5, '2024-01-01']);
    await mysqlPool.query('INSERT IGNORE INTO billing_rates (tier_name, cost_per_m3, min_usage_m3, max_usage_m3, effective_date) VALUES (?, ?, ?, ?, ?)', ['Standard', 12.75, 6, 20, '2024-01-01']);
    await mysqlPool.query('INSERT IGNORE INTO billing_rates (tier_name, cost_per_m3, min_usage_m3, max_usage_m3, effective_date) VALUES (?, ?, ?, ?, ?)', ['Premium', 25.00, 21, 9999, '2024-01-01']);

    console.log('✅ Seeding Complete! Cloud Databases are ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error Details:');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
};

seed();
