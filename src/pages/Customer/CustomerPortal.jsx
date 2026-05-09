import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiArrowRight, FiShield, FiCreditCard, FiActivity } from 'react-icons/fi';

const CustomerPortal = () => {
  const [latestBill, setLatestBill] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billsRes, paymentsRes] = await Promise.all([
          axios.get('/bills/my'),
          axios.get('/payments/my'),
        ]);

        const bills = billsRes.data.bills || [];
        const unpaid = bills.find(b => b.status === 'Unpaid' || b.status === 'Overdue');
        setLatestBill(unpaid || bills[0] || null);

        setRecentPayments((paymentsRes.data.payments || []).slice(0, 3));

        const chart = bills.slice(0, 6).reverse().map(b => ({
          month: b.month.substring(0, 3),
          usage: parseFloat(b.usage_m3),
        }));
        setUsageHistory(chart);
      } catch {
        setError('Failed to load portal data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Synchronizing secure data...</div>;

  return (
    <div className="animate-fade-in">
      {error && (
        <div style={{ background: 'rgba(255, 66, 66, 0.1)', color: '#ff4242', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255, 66, 66, 0.2)' }}>
          {error}
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card glass-panel" style={{ 
          gridColumn: 'span 2', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.1) 0%, rgba(255, 0, 122, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
               <FiCreditCard color="var(--bwt-blue)" />
               <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px' }}>
                 {latestBill ? `CURRENT BILLING — ${latestBill.month.toUpperCase()}` : 'ALL CLEAR'}
               </p>
            </div>
            <h2 style={{ color: 'white', margin: '0.5rem 0', fontSize: '3rem', fontWeight: 800 }}>
              {latestBill ? `M ${parseFloat(latestBill.amount_due).toFixed(2)}` : 'M 0.00'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
               <span style={{ 
                 padding: '0.25rem 0.75rem', 
                 borderRadius: '4px', 
                 fontSize: '0.75rem', 
                 fontWeight: 800,
                 backgroundColor: latestBill?.status === 'Overdue' ? 'var(--bwt-pink)' : 'var(--bwt-blue)',
                 color: 'white'
               }}>
                 {latestBill?.status || 'PAID'}
               </span>
               <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                 {latestBill ? `Due by ${latestBill.due_date?.substring(0, 10)}` : 'No outstanding amount due'}
               </p>
            </div>
          </div>
          <div>
            {latestBill && latestBill.status !== 'Paid' && (
              <Link to="/customer/pay" state={{ bill: latestBill }} className="btn-primary"
                style={{ fontSize: '1rem', padding: '1.25rem 2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 180, 216, 0.3)' }}>
                Pay Securely
              </Link>
            )}
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <FiShield color="var(--bwt-blue)" />
             <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM STATUS</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#00FFC2', boxShadow: '0 0 10px #00FFC2' }}></div>
            <span style={{ fontWeight: '800', fontSize: '1.5rem' }}>ENCRYPTED</span>
          </div>
          <p style={{ color: 'var(--bwt-blue)', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
            ACC: {latestBill?.account_number || 'BWT-W-992'}
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
             <FiActivity color="var(--bwt-blue)" />
             <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Usage Pattern (kL)</h3>
          </div>
          {usageHistory.length > 0 ? (
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ backgroundColor: 'var(--bwt-dark)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="usage" radius={[6, 6, 0, 0]}>
                    {usageHistory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === usageHistory.length - 1 ? 'var(--bwt-pink)' : 'var(--bwt-blue)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No historical data detected.
            </div>
          )}
        </div>

        <div className="card glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Activity</h3>
            <Link to="/customer/history" style={{ fontSize: '0.85rem', color: 'var(--bwt-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              History <FiArrowRight />
            </Link>
          </div>
          {recentPayments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Amount</th>
                  <th>Ref #</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map(p => (
                  <tr key={p.payment_id}>
                    <td>{p.payment_date?.substring(0, 10)}</td>
                    <td><strong style={{ color: 'var(--bwt-blue)' }}>M {parseFloat(p.amount_paid).toFixed(2)}</strong></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.reference_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No recent payments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;
