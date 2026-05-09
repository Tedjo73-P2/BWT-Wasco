const fs = require('fs');
const path = require('path');
const pgPool = require('./db/core');
const mysqlPool = require('./db/billing');

const initialize = async () => {
  console.log('📡 Initializing Cloud Database Schemas (FORCE REBUILD)...');
  
  try {
    // 1. PostgreSQL (Supabase)
    console.log('🐘 Building PostgreSQL Schema (Supabase)...');
    
    // Force drop to ensure structure matches
    const dropPg = `
      DROP VIEW IF EXISTS v_district_revenue CASCADE;
      DROP VIEW IF EXISTS v_outstanding_balances CASCADE;
      DROP TABLE IF EXISTS leakage_reports CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
      DROP TABLE IF EXISTS districts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `;
    await pgPool.query(dropPg);
    
    const pgSql = fs.readFileSync(path.join(__dirname, 'db', 'init_core.sql'), 'utf8');
    await pgPool.query(pgSql);
    console.log('✅ PostgreSQL Schema Rebuilt.');

    // 2. MySQL (Railway)
    console.log('🐬 Building MySQL Schema (Railway)...');
    const dropMysql = `
      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS bills;
      DROP TABLE IF EXISTS billing_rates;
    `;
    const mysqlSql = fs.readFileSync(path.join(__dirname, 'db', 'init_billing_mysql.sql'), 'utf8');
    
    const mysqlStatements = (dropMysql + mysqlSql)
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of mysqlStatements) {
      try {
        await mysqlPool.query(statement);
      } catch (err) {
        console.warn(`⚠️ MySQL Warning: ${err.message}`);
      }
    }
    console.log('✅ MySQL Schema Rebuilt.');

    console.log('🏁 Cloud databases are fully synchronized!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Initialization Error:', err.message);
    process.exit(1);
  }
};

initialize();
