const { pool } = require('../db/billing');

async function fixViews() {
  try {
    console.log('Updating views to fix ONLY_FULL_GROUP_BY issues...');
    
    const dailyView = `
      CREATE OR REPLACE VIEW daily_usage_analytics AS
      SELECT 
          DATE(created_at) as date,
          SUM(usage_m3) as total_usage_m3,
          SUM(amount_due) as projected_revenue,
          SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) as realized_revenue,
          SUM(CASE WHEN status != 'Paid' THEN amount_due ELSE 0 END) as uncollected_revenue,
          ROUND((SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) / NULLIF(SUM(amount_due), 0)) * 100, 2) as collection_efficiency,
          COUNT(*) as total_bills
      FROM bills
      GROUP BY date
      ORDER BY date DESC;
    `;

    const weeklyView = `
      CREATE OR REPLACE VIEW weekly_usage_analytics AS
      SELECT 
          STR_TO_DATE(CONCAT(YEARWEEK(created_at, 1), ' Monday'), '%X%V %W') as week_start,
          SUM(usage_m3) as total_usage_m3,
          SUM(amount_due) as projected_revenue,
          SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) as realized_revenue,
          SUM(CASE WHEN status != 'Paid' THEN amount_due ELSE 0 END) as uncollected_revenue,
          ROUND((SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) / NULLIF(SUM(amount_due), 0)) * 100, 2) as collection_efficiency,
          COUNT(*) as total_bills
      FROM bills
      GROUP BY week_start
      ORDER BY week_start DESC;
    `;

    await pool.query(dailyView);
    console.log('Daily view updated.');
    
    await pool.query(weeklyView);
    console.log('Weekly view updated.');

    console.log('All views successfully synchronized.');
  } catch (err) {
    console.error('Error fixing views:', err.message);
  } finally {
    process.exit();
  }
}

fixViews();
