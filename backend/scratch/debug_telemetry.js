const { pool } = require('../db/billing');

async function debugTelemetry() {
  try {
    console.log('--- DB Data Audit ---');
    const [bills] = await pool.query('SELECT * FROM bills LIMIT 5');
    console.log('Bills sample:', bills);

    const [monthly] = await pool.query('SELECT * FROM view_monthly_revenue LIMIT 5');
    console.log('Monthly View result:', monthly);

    const [weekly] = await pool.query('SELECT * FROM weekly_usage_analytics LIMIT 5');
    console.log('Weekly View result:', weekly);

    const [daily] = await pool.query('SELECT * FROM daily_usage_analytics LIMIT 5');
    console.log('Daily View result:', daily);

  } catch (err) {
    console.error('Audit Error:', err.message);
  } finally {
    process.exit();
  }
}

debugTelemetry();
