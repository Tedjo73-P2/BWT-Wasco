const { pool } = require('../db/billing');

async function debugPeriods() {
  try {
    console.log('--- Testing Yearly ---');
    const yearlyQuery = `SELECT year, SUM(total_bills) as total_bills, SUM(total_usage_m3) as total_usage_m3, 
                 SUM(projected_revenue) as projected_revenue, SUM(realized_revenue) as realized_revenue,
                 SUM(uncollected_revenue) as uncollected_revenue, ROUND(AVG(collection_efficiency), 2) as collection_efficiency
                 FROM usage_analytics GROUP BY year ORDER BY year DESC`;
    const [yearly] = await pool.query(yearlyQuery);
    console.log('Yearly result:', yearly);

    console.log('\n--- Testing Quarterly ---');
    const quarterlyQuery = `SELECT t.year, t.quarter,
                 SUM(t.total_bills) as total_bills, SUM(t.total_usage_m3) as total_usage_m3, 
                 SUM(t.projected_revenue) as projected_revenue, SUM(t.realized_revenue) as realized_revenue,
                 SUM(t.uncollected_revenue) as uncollected_revenue, ROUND(AVG(t.collection_efficiency), 2) as collection_efficiency
                 FROM (
                   SELECT year, CONCAT('Q', QUARTER(STR_TO_DATE(CONCAT('01 ', month, ' ', year), '%d %b %Y'))) as quarter,
                   total_bills, total_usage_m3, projected_revenue, realized_revenue, uncollected_revenue, collection_efficiency
                   FROM usage_analytics
                 ) as t
                 GROUP BY t.year, t.quarter 
                 ORDER BY t.year DESC, t.quarter DESC`;
    const [quarterly] = await pool.query(quarterlyQuery);
    console.log('Quarterly result:', quarterly);

  } catch (err) {
    console.error('Debug Error:', err.message);
  } finally {
    process.exit();
  }
}

debugPeriods();
