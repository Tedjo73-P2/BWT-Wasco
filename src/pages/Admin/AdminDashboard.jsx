import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiUsers, FiFileText, FiActivity, FiAlertCircle, FiSettings, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [leakages, setLeakages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billStats, custStats, leakRes] = await Promise.all([
          axios.get('/bills/stats'),
          axios.get('/customers/stats'),
          axios.get('/leakages'),
        ]);
        setStats(billStats.data);
        setCustomerStats(custStats.data);
        setLeakages((leakRes.data || []).slice(0, 4));
      } catch (err) {
        console.error('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fmt = (n) => n != null ? n.toLocaleString() : '—';

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>System <span className="gradient-text">Command Center</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Operational oversight and administrative control panel</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card glass-panel" style={{ borderLeft: '4px solid var(--bwt-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Total Customers</span>
            <FiUsers color="var(--bwt-blue)" size={20} />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>
            {loading ? '...' : fmt(customerStats?.totalCustomers)}
          </p>
        </div>
        <div className="card glass-panel" style={{ borderLeft: '4px solid var(--bwt-teal, #00FFC2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Monthly Bills</span>
            <FiFileText color="#00FFC2" size={20} />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>
            {loading ? '...' : fmt(stats?.billsGeneratedThisMonth)}
          </p>
        </div>
        <div className="card glass-panel" style={{ borderLeft: '4px solid var(--bwt-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Collected Revenue</span>
            <FiActivity color="var(--bwt-blue)" size={20} />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
            {loading ? '...' : `M ${fmt(stats?.totalRevenue)}`}
          </p>
        </div>
        <div className="card glass-panel" style={{ borderLeft: '4px solid var(--bwt-pink)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Outstanding Debt</span>
            <FiAlertCircle color="var(--bwt-pink)" size={20} />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: 'var(--bwt-pink)' }}>
            {loading ? '...' : `M ${fmt(stats?.outstandingBalance)}`}
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card glass-panel">
          <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>Administrative Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/admin/bills" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <FiFileText /> Generate Monthly Bills
            </Link>
            <Link to="/admin/customers" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <FiUsers /> Manage Customer Base
            </Link>
            <Link to="/admin/rates" className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              <FiSettings /> Configure Billing Parameters
            </Link>
          </div>
        </div>

        <div className="card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Urgent Leakages</h3>
             <Link to="/admin/leakages" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View All <FiArrowRight />
             </Link>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Synchronizing reports...</p>
          ) : leakages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>All systems stable. No active reports.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leakages.map(l => (
                <div key={l.report_id} style={{ 
                  padding: '1.25rem', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                       <span style={{
                         width: '10px', height: '10px', borderRadius: '50%',
                         backgroundColor: l.urgency === 'High' ? 'var(--bwt-pink)' : l.urgency === 'Medium' ? '#feca57' : '#2bce89',
                         boxShadow: `0 0 10px ${l.urgency === 'High' ? 'var(--bwt-pink)' : 'transparent'}`
                       }}></span>
                       <strong style={{ fontSize: '0.95rem' }}>{l.location}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {l.account_number} · Status: <span style={{ color: 'var(--bwt-blue)' }}>{l.status}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                      {l.urgency.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
