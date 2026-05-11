import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiX, FiCheck, FiFilter, FiFileText, FiUser, FiCalendar, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ManageBills = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);

  const [genForm, setGenForm] = useState({
    accountNumber: '', month: '', year: new Date().getFullYear(),
    meterPrevious: '', meterCurrent: '', dueDate: ''
  });
  const [genLoading, setGenLoading] = useState(false);
  const [genMsg, setGenMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterMonth) params.month = filterMonth;
      if (filterStatus) params.status = filterStatus;
      
      const [billsRes, custRes] = await Promise.all([
        axios.get('/bills', { params }),
        axios.get('/customers')
      ]);
      
      setBills(billsRes.data);
      setCustomers(custRes.data);
    } catch {
      setError('❌ Failed to synchronize billing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterMonth, filterStatus]);

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    setGenMsg('');
    try {
      const res = await axios.post('/bills', genForm);
      setGenMsg(`✅ Invoice BL-${res.data.bill_id} generated successfully.`);
      setShowGenerate(false);
      setGenForm({
        accountNumber: '', month: '', year: new Date().getFullYear(),
        meterPrevious: '', meterCurrent: '', dueDate: ''
      });
      fetchData();
    } catch (err) {
      setGenMsg(`❌ ${err.response?.data?.error || 'Generation protocol failed.'}`);
    } finally {
      setGenLoading(false);
    }
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const inputStyle = {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    fontSize: '0.9rem'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '12px'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <FiFileText className="gradient-text" size={24} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Invoice <span className="gradient-text">Management</span></h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Deploy and track national billing nodes. Real-time consumption auditing.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setShowGenerate(!showGenerate); setGenMsg(''); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: '14px' }}
        >
          {showGenerate ? <FiX /> : <FiPlus />}
          {showGenerate ? 'Abort Generation' : 'Initialize Invoice'}
        </button>
      </div>

      <AnimatePresence>
        {genMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: '1.25rem 1.5rem', borderRadius: '12px', marginBottom: '2rem',
              background: genMsg.startsWith('✅') ? 'rgba(0, 255, 194, 0.1)' : 'rgba(255, 0, 122, 0.1)',
              border: genMsg.startsWith('✅') ? '1px solid rgba(0, 255, 194, 0.2)' : '1px solid rgba(255, 0, 122, 0.2)',
              color: genMsg.startsWith('✅') ? '#00FFC2' : 'var(--bwt-pink)',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}
          >
            {genMsg.startsWith('✅') ? <FiCheck /> : <FiX />}
            {genMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGenerate && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="card glass-panel" 
            style={{ padding: '2.5rem', marginBottom: '3rem', border: '1px solid var(--bwt-blue-glow)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
               <FiTrendingUp color="var(--bwt-blue)" />
               <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Generate Deployment Invoice</h3>
            </div>
            
            <form onSubmit={handleGenerateBill}>
              <div className="grid-2" style={{ gap: '2rem', marginBottom: '2.5rem' }}>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <FiUser size={14} /> SELECT CUSTOMER NODE
                  </label>
                  <select 
                    required 
                    style={selectStyle}
                    value={genForm.accountNumber}
                    onChange={async (e) => {
                      const acc = e.target.value;
                      setGenForm({ ...genForm, accountNumber: acc });
                      if (acc) {
                        try {
                          const res = await axios.get(`/bills/latest-reading/${acc}`);
                          const now = new Date();
                          const currentMonth = now.toLocaleString('default', { month: 'short' });
                          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
                          setGenForm(prev => ({ 
                            ...prev, 
                            accountNumber: acc,
                            meterPrevious: res.data.lastReading,
                            month: currentMonth,
                            year: now.getFullYear(),
                            dueDate: nextMonth.toISOString().split('T')[0]
                          }));
                        } catch (err) { console.error(err); }
                      }
                    }}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>-- Search Global Registry --</option>
                    {customers.map(c => (
                      <option key={c.account_number} value={c.account_number} style={{ background: '#1a1a2e' }}>
                        {c.full_name} | {c.account_number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <FiCalendar size={14} /> TERMINAL DUE DATE
                  </label>
                  <input type="date" required style={inputStyle} value={genForm.dueDate} onChange={e => setGenForm({ ...genForm, dueDate: e.target.value })} />
                </div>
                <div className="grid-2" style={{ gap: '1rem' }}>
                   <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CYCLE MONTH</label>
                      <select required style={selectStyle} value={genForm.month} onChange={e => setGenForm({ ...genForm, month: e.target.value })}>
                        <option value="" style={{ background: '#1a1a2e' }}>Month</option>
                        {months.map(m => <option key={m} value={m} style={{ background: '#1a1a2e' }}>{m}</option>)}
                      </select>
                   </div>
                   <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CYCLE YEAR</label>
                      <input type="number" required style={inputStyle} value={genForm.year} min="2020" max="2030" onChange={e => setGenForm({ ...genForm, year: e.target.value })} />
                   </div>
                </div>
                <div className="grid-2" style={{ gap: '1rem' }}>
                   <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PREVIOUS (m3)</label>
                      <input type="number" required step="0.01" style={inputStyle} value={genForm.meterPrevious} onChange={e => setGenForm({ ...genForm, meterPrevious: e.target.value })} />
                   </div>
                   <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRENT (m3)</label>
                      <input type="number" required step="0.01" style={inputStyle} value={genForm.meterCurrent} onChange={e => setGenForm({ ...genForm, meterCurrent: e.target.value })} />
                   </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button type="submit" className="btn-primary" disabled={genLoading} style={{ padding: '1rem 3rem', borderRadius: '12px' }}>
                  {genLoading ? 'Processing...' : 'Deploy Invoice'}
                </button>
                <button type="button" className="btn-outline" onClick={() => setShowGenerate(false)} style={{ padding: '1rem 2rem', borderRadius: '12px' }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginBottom: '2.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--bwt-blue)', fontWeight: 700 }}>
           <FiFilter /> FILTERS
        </div>
        <select style={{ ...selectStyle, width: '200px' }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
          <option value="" style={{ background: '#1a1a2e' }}>All Cycles</option>
          {months.map(m => <option key={m} value={m} style={{ background: '#1a1a2e' }}>{m}</option>)}
        </select>
        <select style={{ ...selectStyle, width: '200px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="" style={{ background: '#1a1a2e' }}>Global Status</option>
          <option value="Paid" style={{ background: '#1a1a2e' }}>Paid</option>
          <option value="Unpaid" style={{ background: '#1a1a2e' }}>Unpaid</option>
          <option value="Overdue" style={{ background: '#1a1a2e' }}>Overdue</option>
        </select>
      </div>

      <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Invoice ID</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer Node</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cycle</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Usage (m3)</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Due</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Terminal Date</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving distributed invoices...</td></tr>
            ) : bills.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No invoice records found in grid.</td></tr>
            ) : bills.map(b => (
              <tr key={b.bill_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--bwt-blue)', fontWeight: 800 }}>BL-{b.bill_id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ fontWeight: 700 }}>{b.account_number}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{b.month} {b.year}</td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{parseFloat(b.usage_m3).toFixed(2)} m3</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiTrendingUp color="var(--bwt-blue)" size={14} />
                      <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>M {parseFloat(b.amount_due).toFixed(2)}</span>
                   </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{b.due_date?.substring(0, 10)}</td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <span style={{
                    padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px',
                    backgroundColor: b.status === 'Paid' ? 'rgba(0, 255, 194, 0.1)' : b.status === 'Overdue' ? 'rgba(255, 171, 0, 0.1)' : 'rgba(255, 0, 122, 0.1)',
                    color: b.status === 'Paid' ? '#00FFC2' : b.status === 'Overdue' ? '#FFAB00' : 'var(--bwt-pink)',
                    border: `1px solid ${b.status === 'Paid' ? 'rgba(0, 255, 194, 0.2)' : b.status === 'Overdue' ? 'rgba(255, 171, 0, 0.2)' : 'rgba(255, 0, 122, 0.2)'}`
                  }}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBills;
