const { pool } = require('../db/billing');

async function fixUsageAnalytics() {
  try {
    console.log('Synchronizing usage_analytics view with latest schema...');
    
    // Re-create usage_analytics to pick up the new columns from view_monthly_revenue
    await pool.query('CREATE OR REPLACE VIEW usage_analytics AS SELECT * FROM view_monthly_revenue');
    
    console.log('usage_analytics view successfully synchronized.');

  } catch (err) {
    console.error('Error fixing usage_analytics:', err.message);
  } finally {
    process.exit();
  }
}

fixUsageAnalytics();
