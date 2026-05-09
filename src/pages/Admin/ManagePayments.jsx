import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDollarSign, FiPlus, FiX, FiCheck, FiFilter, FiSearch, FiEdit2, FiCalendar, FiUser, FiCreditCard } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Search/Filter state
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('');

  const [form, setForm] = useState({
    billId: '',
    amountPaid: '',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/payments');
      setPayments(res.data);
    } catch {
      setError('❌ Synchronization failure. Payment ledger unreachable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (p) => {
    setEditingPayment(p);
    setForm({
      billId: p.bill_id,
      amountPaid: p.amount_paid,
      paymentMethod: p.payment_method,
      paymentDate: p.payment_date?.substring(0, 10)
    });
    setShowAdd(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (editingPayment) {
        await axios.put(`/payments/${editingPayment.payment_id}`, form);
      } else {
        await axios.post('/payments', form);
      }
      setShowAdd(false);
      setEditingPayment(null);
      setForm({ billId: '', amountPaid: '', paymentMethod: 'Cash', paymentDate: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Transmission failed.');
    } finally {
      setProcessing(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '0.8rem 1rem',
    width: '100%',
    outline: 'none',
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

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.account_number.toLowerCase().includes(search.toLowerCase()) || 
                          p.reference_number.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = filterMethod === '' || p.payment_method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <FiDollarSign className="gradient-text" size={24} />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Payment <span className="gradient-text">Ledger</span></h2>
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Global collection monitoring and fiscal node validation.</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
           <input
             type="text"
             placeholder="Search by account or reference..."
             style={{ ...inputStyle, paddingLeft: '3rem' }}
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
           <FiSearch style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        </div>
        <div style={{ position: 'relative', width: '250px' }}>
           <select style={selectStyle} value={filterMethod} onChange={e => setFilterMethod(e.target.value)}>
             <option value="" style={{ background: '#1a1a2e' }}>All Methods</option>
             <option value="Cash" style={{ background: '#1a1a2e' }}>Cash</option>
             <option value="Mobile Money" style={{ background: '#1a1a2e' }}>Mobile Money</option>
             <option value="Card" style={{ background: '#1a1a2e' }}>Card</option>
             <option value="Bank Transfer" style={{ background: '#1a1a2e' }}>Bank Transfer</option>
           </select>
           <FiFilter style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
        </div>
      </div>

      {error && <div className="card glass-panel" style={{ color: 'var(--bwt-pink)', border: '1px solid rgba(255, 0, 122, 0.2)', marginBottom: '2rem', background: 'rgba(255, 0, 122, 0.05)' }}>{error}</div>}

      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reference / Date</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Node</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Billing Cycle</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fiscal Amount</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Method</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Control</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving fiscal telemetry...</td></tr>
            ) : filteredPayments.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No payment signatures detected.</td></tr>
            ) : filteredPayments.map(p => (
              <tr key={p.payment_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--bwt-blue)', fontSize: '0.9rem' }}>{p.reference_number}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                     <FiCalendar size={12} /> {p.payment_date?.substring(0, 10)}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiUser size={14} color="rgba(255,255,255,0.4)" /> {p.account_number}
                   </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                   {p.month} {p.year}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#00FFC2' }}>M {parseFloat(p.amount_paid).toFixed(2)}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <FiCreditCard size={14} color="var(--bwt-blue)" /> {p.payment_method}
                   </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleEdit(p)}
                    className="btn-outline"
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FiEdit2 size={12} /> CORRECT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card glass-panel" 
              style={{ width: '100%', maxWidth: '600px', padding: '3rem', border: '1px solid var(--bwt-blue-glow)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                 <div>
                    <h3 style={{ margin: 0, fontSize: '1.8rem' }}>Fiscal Correction</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Adjusting record {editingPayment?.reference_number}</p>
                 </div>
                 <button onClick={() => { setShowAdd(false); setEditingPayment(null); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><FiX size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>COLLECTED AMOUNT (M)</label>
                    <input type="number" step="0.01" style={inputStyle} value={form.amountPaid} onChange={e => setForm({...form, amountPaid: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>PAYMENT METHOD</label>
                    <select style={selectStyle} value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} required>
                      <option value="Cash" style={{ background: '#1a1a2e' }}>Cash</option>
                      <option value="Mobile Money" style={{ background: '#1a1a2e' }}>Mobile Money</option>
                      <option value="Card" style={{ background: '#1a1a2e' }}>Card</option>
                      <option value="Bank Transfer" style={{ background: '#1a1a2e' }}>Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>TRANSACTION DATE</label>
                  <input type="date" style={inputStyle} value={form.paymentDate} onChange={e => setForm({...form, paymentDate: e.target.value})} required />
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1.25rem', borderRadius: '12px' }} disabled={processing}>
                    {processing ? 'TRANSMITTING...' : <><FiCheck /> SYNC CORRECTION</>}
                  </button>
                  <button type="button" className="btn-outline" style={{ flex: 1, padding: '1.25rem', borderRadius: '12px' }} onClick={() => { setShowAdd(false); setEditingPayment(null); }}>
                    ABORT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePayments;
