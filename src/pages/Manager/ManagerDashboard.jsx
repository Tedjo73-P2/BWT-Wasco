import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiDatabase, FiCpu, FiTrendingUp, FiAlertCircle, FiDownload, FiBarChart2, FiPieChart } from 'react-icons/fi';

const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const ManagerDashboard = () => {
  const [period, setPeriod] = useState('Daily');
  const [insights, setInsights] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [generalStats, setGeneralStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const [insightsRes, custStats, billStats] = await Promise.all([
          axios.get('/bills/insights', { params: { period } }),
          axios.get('/customers/stats'),
          axios.get('/bills/stats'),
        ]);
        setInsights(insightsRes.data);
        setCustomerStats(custStats.data);
        setGeneralStats(billStats.data);
      } catch (err) {
        console.error('Manager fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [period]);

  const chartData = (insights?.period === period ? (insights?.history || []) : []).map(item => {
    let name = '';
    if (period === 'Daily') {
       name = item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : (item.date || '');
    }
    else if (period === 'Weekly') {
       name = item.week_start ? `W${item.week_start.toString().substring(5)}` : (item.week_start || '');
    }
    else if (period === 'Quarterly') name = (item.quarter && item.year) ? `${item.quarter} ${item.year}` : (item.quarter || item.year || '');
    else if (period === 'Yearly') name = item.year || '';
    else name = (item.month && item.year) ? `${item.month} ${item.year}` : (item.month || item.year || '');

    return {
      name,
      consumption: parseFloat(item.total_usage_m3 || 0),
      revenue: parseFloat(item.revenue || item.projected_revenue || 0),
      bills: parseInt(item.bills_generated || item.total_bills || 0),
      efficiency: parseFloat(item.collection_efficiency || 0)
    };
  }).reverse();

  const revenueData = [
    { name: 'Revenue (Realized)', value: parseFloat(generalStats?.totalRevenue || 0), color: '#00FFC2' },
    { name: 'Outstanding Amount', value: parseFloat(generalStats?.outstandingBalance || 0), color: 'var(--bwt-pink)' },
  ];

  const fmt = (n) => n != null ? parseFloat(n).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—';
  const fmtMoney = (n) => n != null ? parseFloat(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
    })
  };

  return (
    <div className="animate-fade-in">
      {/* Strategic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
             <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00FFC2', boxShadow: '0 0 15px #00FFC2' }}></div>
             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--bwt-blue)', letterSpacing: '2px', textTransform: 'uppercase' }}>Branch Manager Insight Terminal</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>
            Strategic <span className="gradient-text">Overview</span>
          </h2>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={period === p ? 'btn-primary' : 'btn-outline'}
              style={{ 
                padding: '0.6rem 1.4rem', 
                fontSize: '0.85rem', 
                border: 'none',
                background: period === p ? '' : 'transparent',
                borderRadius: '12px'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '3rem' }}>
        {[
          { label: 'Total Customers', val: fmt(customerStats?.totalCustomers), sub: 'National Service Segments', icon: FiDatabase, color: 'var(--bwt-blue)' },
          { label: 'Annual Flow', val: `${fmt(insights?.summary?.totalUsageYear)} kL`, sub: 'National Usage Pattern', icon: FiCpu, color: 'white' },
          { label: 'Total Revenue', val: `M ${fmt(generalStats?.totalRevenue)}`, sub: 'Realized Bill Payments', icon: FiTrendingUp, color: '#00FFC2' },
          { label: 'Outstanding Amount', val: `M ${fmt(generalStats?.outstandingBalance)}`, sub: 'Current Uncollected Debt', icon: FiAlertCircle, color: 'var(--bwt-pink)' }
        ].map((s, i) => (
          <motion.div 
            key={i} 
            custom={i} 
            initial="hidden" 
            animate="visible" 
            variants={cardVariants}
            className="card glass-panel" 
            style={{ 
              padding: '1.75rem', 
              position: 'relative', 
              overflow: 'hidden',
              borderLeft: i === 3 ? '4px solid var(--bwt-pink)' : '1px solid var(--border-color)'
            }}
          >
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}>
               <s.icon size={100} />
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
            <h3 style={{ fontSize: '2.4rem', color: s.color, margin: '0 0 0.5rem 0', fontWeight: 800 }}>{loading ? '...' : s.val}</h3>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.sub}</small>
          </motion.div>
        ))}
      </div>

      {/* Advanced Insights Hub */}
      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card glass-panel"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Water Usage Patterns</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Consumption (kL) consumed across segments over time</p>
            </div>
            <FiBarChart2 color="var(--bwt-blue)" size={24} />
          </div>
          
          <div style={{ height: '350px' }}>
            {(!loading && chartData.length > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--bwt-blue)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--bwt-blue)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bwt-dark)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 15px 35px rgba(0,0,0,0.6)' }}
                    itemStyle={{ fontWeight: 800, color: 'var(--bwt-blue)' }}
                  />
                  <Area type="monotone" dataKey="consumption" stroke="var(--bwt-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                {loading ? 'Analyzing usage patterns...' : 'No telemetry detected.'}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card glass-panel"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Bills: Revenue & Outstanding</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>National fiscal health and capital exposure</p>
            </div>
            <FiPieChart color="var(--bwt-pink)" size={24} />
          </div>
          
          <div style={{ height: '350px' }}>
            {(generalStats?.totalRevenue + generalStats?.outstandingBalance) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueData} innerRadius={90} outerRadius={130} paddingAngle={10} dataKey="value" stroke="none">
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 10px ${entry.color}44)` }} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `M ${parseFloat(value).toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'var(--bwt-dark)', borderRadius: '12px', border: '1px solid var(--border-color)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '30px', color: 'white', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                {loading ? 'Compiling bill analytics...' : 'No fiscal nodes detected.'}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Payment Trends & summative breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.6 }}
        className="card glass-panel"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Payment Trends Over Time</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Summative billing and collection telemetry by {period} interval</p>
          </div>
          <button className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={() => window.print()}>
            <FiDownload /> Export Insight Report
          </button>
        </div>
        
        <div style={{ height: '300px', marginBottom: '3rem' }}>
          {!loading && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bwt-dark)', border: '1px solid var(--border-color)' }} />
              <Bar dataKey="revenue" fill="var(--bwt-blue)" radius={[4, 4, 0, 0]} name="Payment Trend (M)" />
            </BarChart>
          </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              {loading ? 'Synchronizing payment telemetry...' : 'No fiscal trends detected.'}
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Time Interval</th>
                <th>Grid Load (Bills)</th>
                <th>Water Usage (kL)</th>
                <th>Revenue Potential (M)</th>
                <th>Node Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, idx) => (
                <tr key={idx}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--bwt-blue)' }}></div>
                    <strong>{row.name}</strong>
                  </div></td>
                  <td>{fmt(row.bills)} units</td>
                  <td>{fmt(row.consumption)} kL</td>
                  <td style={{ color: 'var(--bwt-blue)', fontWeight: 800 }}>M {fmtMoney(row.revenue)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{ width: `${row.efficiency}%`, height: '100%', background: 'var(--bwt-blue)', borderRadius: '2px', boxShadow: `0 0 10px ${row.efficiency > 80 ? 'var(--bwt-blue)' : 'var(--bwt-pink)'}` }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: row.efficiency > 80 ? '#00FFC2' : 'var(--bwt-pink)' }}>{row.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManagerDashboard;
