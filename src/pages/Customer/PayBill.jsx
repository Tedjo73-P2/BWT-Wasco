import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiDollarSign, FiFileText, FiCheckCircle, FiShield, FiArrowRight, FiX, FiInfo, FiCreditCard } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PayBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preloadedBill = location.state?.bill || null;

  const [bills, setBills] = useState([]);
  const [selectedBillId, setSelectedBillId] = useState(preloadedBill?.bill_id || '');
  const [selectedBill, setSelectedBill] = useState(preloadedBill);
  const [amount, setAmount] = useState(preloadedBill ? parseFloat(preloadedBill.amount_due) : 0);
  const [method, setMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/bills/my', { params: { status: 'Unpaid' } })
      .then(res => {
        setBills(res.data.bills || []);
        if (!preloadedBill && res.data.bills?.length > 0) {
          const first = res.data.bills[0];
          setSelectedBillId(first.bill_id);
          setSelectedBill(first);
          setAmount(parseFloat(first.amount_due));
        }
      })
      .catch(() => {});
  }, []);

  const handleBillChange = (id) => {
    const bill = bills.find(b => b.bill_id === parseInt(id));
    setSelectedBillId(id);
    setSelectedBill(bill || null);
    setAmount(bill ? parseFloat(bill.amount_due) : 0);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/payments', {
        billId: selectedBillId,
        amountPaid: amount,
        paymentMethod: method,
      });
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Transmission failure. Please retry.');
    } finally {
      setLoading(false);
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

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card glass-panel" 
        style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '4rem 3rem' }}
      >
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
           <FiCheckCircle size={64} color="#00FFC2" />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>FUNDS <span className="gradient-text">RECEIVED</span></h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{success.message}</p>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'left' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Reference:</span>
              <strong style={{ color: 'var(--bwt-blue)' }}>{success.payment?.reference_number}</strong>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
              <strong style={{ color: '#00FFC2' }}>M {parseFloat(success.payment?.amount_paid).toFixed(2)}</strong>
           </div>
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '12px' }} onClick={() => navigate('/customer/bills')}>
          Return to Billing Hub
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <FiCreditCard className="gradient-text" size={24} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Secure <span className="gradient-text">Gateway</span></h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Initiating fiscal settlement for the national utility grid.</p>
      </div>

      <div className="grid-2" style={{ gap: '2.5rem' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
             <FiFileText color="var(--bwt-blue)" size={20} />
             <h3 style={{ margin: 0 }}>Bill Summary</h3>
          </div>

          {bills.length > 0 ? (
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>SELECT OUTSTANDING INVOICE</label>
              <select style={selectStyle} value={selectedBillId} onChange={e => handleBillChange(e.target.value)}>
                {bills.map(b => (
                  <option key={b.bill_id} value={b.bill_id} style={{ background: '#1a1a2e' }}>
                    {b.month} {b.year} — M {parseFloat(b.amount_due).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)', marginBottom: '2rem' }}>
               <FiCheckCircle size={32} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
               <p style={{ margin: 0, color: 'var(--text-muted)' }}>No outstanding debts detected.</p>
            </div>
          )}

          {selectedBill && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Invoice ID</span>
                  <strong style={{ color: 'var(--bwt-blue)' }}>BL-{selectedBill.bill_id}</strong>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Usage Analysis</span>
                  <strong>{parseFloat(selectedBill.usage_m3).toFixed(2)} m3</strong>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Node Status</span>
                  <span style={{ 
                    color: selectedBill.status === 'Overdue' ? 'var(--bwt-pink)' : '#FFAB00',
                    fontWeight: 800,
                    fontSize: '0.8rem'
                  }}>{selectedBill.status.toUpperCase()}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', marginTop: '1rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total Due</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00FFC2' }}>M {parseFloat(selectedBill.amount_due).toFixed(2)}</span>
               </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card glass-panel" style={{ padding: '2.5rem', border: '1px solid var(--bwt-blue-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
             <FiShield color="#00FFC2" size={20} />
             <h3 style={{ margin: 0 }}>Payment Protocol</h3>
          </div>

          <form onSubmit={handlePay}>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>TRANSFER AMOUNT (M)</label>
              <div style={{ position: 'relative' }}>
                <input type="number" style={{ ...inputStyle, paddingLeft: '3rem', fontSize: '1.2rem', fontWeight: 800 }} value={amount} onChange={e => setAmount(e.target.value)} min="1" step="0.01" required />
                <FiDollarSign style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
              </div>
              <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Partial settlements are authorized by the grid.</small>
            </div>

            <div className="form-group" style={{ marginBottom: '3rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1.5rem' }}>SELECT SETTLEMENT CHANNEL</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { value: 'mpesa', label: 'M-Pesa Mobile Money' },
                  { value: 'ecocash', label: 'EcoCash Mobile Money' },
                  { value: 'card', label: 'Debit / Credit Card' },
                  { value: 'bank', label: 'National Bank Transfer' },
                ].map(opt => (
                  <label key={opt.value} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', 
                    padding: '1rem', borderRadius: '12px', background: method === opt.value ? 'rgba(0, 180, 216, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: method === opt.value ? '1px solid var(--bwt-blue)' : '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}>
                    <input type="radio" name="method" value={opt.value} checked={method === opt.value} onChange={() => setMethod(opt.value)} style={{ width: '18px', height: '18px', accentColor: 'var(--bwt-blue)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: method === opt.value ? 'white' : 'var(--text-muted)' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.5rem', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 800 }} disabled={loading || !selectedBill}>
              {loading ? 'PROCESSING...' : `DEPLOY M ${parseFloat(amount || 0).toFixed(2)}`}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0, 255, 194, 0.05)', borderRadius: '10px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
             <FiInfo color="#00FFC2" size={16} />
             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transactions are protected by 256-bit grid encryption.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayBill;
