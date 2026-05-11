const { pool } = require('../db/billing');

async function removeTiers() {
  try {
    console.log('Connecting to Billing DB to remove tiers...');
    const [result] = await pool.query('DELETE FROM billing_rates WHERE tier_id IN (1, 2, 3)');
    console.log('Successfully removed Tiers 1, 2, and 3 from the database.', result);
  } catch (err) {
    console.error('Failed to remove tiers:', err.message);
  } finally {
    process.exit();
  }
}

removeTiers();
