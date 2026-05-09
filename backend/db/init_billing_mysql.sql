CREATE TABLE IF NOT EXISTS billing_rates (
    tier_id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL,
    min_usage_m3 DECIMAL(10,2) NOT NULL,
    max_usage_m3 DECIMAL(10,2),
    cost_per_m3 DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    meter_reading_previous DECIMAL(10,2) NOT NULL,
    meter_reading_current DECIMAL(10,2) NOT NULL,
    usage_m3 DECIMAL(10,2) NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Unpaid',
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INTEGER,
    account_number VARCHAR(50) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id)
);

-- Advanced SQL: Outstanding Balances View
CREATE OR REPLACE VIEW view_outstanding_invoices AS
SELECT 
    account_number,
    COUNT(*) as unpaid_bills,
    SUM(amount_due) as total_debt,
    MAX(due_date) as latest_deadline
FROM bills 
WHERE status != 'Paid'
GROUP BY account_number;

-- Advanced SQL: Monthly Revenue View
CREATE OR REPLACE VIEW view_monthly_revenue AS
SELECT 
    month,
    year,
    SUM(amount_due) as projected_revenue,
    SUM(CASE WHEN status = 'Paid' THEN amount_due ELSE 0 END) as realized_revenue,
    SUM(usage_m3) as total_usage_m3,
    COUNT(*) as total_bills
FROM bills
GROUP BY year, month;

-- Advanced SQL: Summative Analytics Views for Manager Dashboard
CREATE OR REPLACE VIEW usage_analytics AS SELECT * FROM view_monthly_revenue;

CREATE OR REPLACE VIEW daily_usage_analytics AS
SELECT 
    DATE(created_at) as date,
    SUM(usage_m3) as total_usage_m3,
    SUM(amount_due) as revenue,
    COUNT(*) as total_bills
FROM bills
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW weekly_usage_analytics AS
SELECT 
    STR_TO_DATE(CONCAT(YEARWEEK(created_at, 1), ' Monday'), '%X%V %W') as week_start,
    SUM(usage_m3) as total_usage_m3,
    SUM(amount_due) as revenue,
    COUNT(*) as total_bills
FROM bills
GROUP BY YEARWEEK(created_at, 1)
ORDER BY week_start DESC;

