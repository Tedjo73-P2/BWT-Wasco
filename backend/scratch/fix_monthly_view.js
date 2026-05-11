const { pool } = require('../db/billing');

async function fixMonthlyView() {
  try {
    console.log('Updating Monthly Revenue view in live DB...');
    
    const monthlyView = `
      CREATE OR REPLACE VIEW view_monthly_revenue AS
      SELECT 
          month,
          year,
          SUM(amount_due) as projected_revenue,
          SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) as realized_revenue,
          SUM(CASE WHEN status != 'Paid' THEN amount_due ELSE 0 END) as uncollected_revenue,
          ROUND((SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) / NULLIF(SUM(amount_due), 0)) * 100, 2) as collection_efficiency,
          SUM(usage_m3) as total_usage_m3,
          COUNT(*) as total_bills
      FROM bills
      GROUP BY year, month;
    `;

    await pool.query(monthlyView);
    console.log('Monthly view successfully updated.');

  } catch (err) {
    console.error('Error fixing monthly view:', err.message);
  } finally {
    process.exit();
  }
}

fixMonthlyView();
