import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSettings, FiEdit2, FiCheck, FiX, FiInfo, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const BillingRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ tierName: '', minUsage: 0, maxUsage: '', costPerM3: 0, effectiveDate: new Date().toISOString().split('T')[0] });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchRates = () => {
    setLoading(true);
    axios.get('/rates')
      .then(res => setRates(res.data))
      .catch(() => setMsg('❌ Failed to load rates.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRates(); }, []);

  const startEdit = (rate) => {
    setEditingId(rate.tier_id);
    setForm({
      tierName: rate.tier_name,
      minUsage: rate.min_usage_m3,
      maxUsage: rate.max_usage_m3 ?? '',
      costPerM3: rate.cost_per_m3,
      effectiveDate: rate.effective_date?.substring(0, 10),
    });
    setMsg('');
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`/rates/${editingId}`, form);
        setMsg('✅ Rate configuration synchronized.');
      } else {
        await axios.post('/rates', form);
        setMsg('✅ New billing tier initialized.');
      }
      setEditingId(null);
      setShowAdd(false);
      setForm({ tierName: '', minUsage: 0, maxUsage: '', costPerM3: 0, effectiveDate: new Date().toISOString().split('T')[0] });
      fetchRates();
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.error || 'Update failed.'}`);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '0.8rem 1rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <FiSettings className="gradient-text" size={24} />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Billing <span className="gradient-text">Parameters</span></h2>
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Global tariff configuration for the National Distributed Grid.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setEditingId(null); setForm({ tierName: '', minUsage: 0, maxUsage: '', costPerM3: 0, effectiveDate: new Date().toISOString().split('T')[0] }); setShowAdd(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: '14px' }}
        >
          <FiPlus /> Initialize New Tier
        </button>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem',
              background: msg.startsWith('✅') ? 'rgba(0, 255, 194, 0.1)' : 'rgba(255, 0, 122, 0.1)',
              border: msg.startsWith('✅') ? '1px solid rgba(0, 255, 194, 0.2)' : '1px solid rgba(255, 0, 122, 0.2)',
              color: msg.startsWith('✅') ? '#00FFC2' : 'var(--bwt-pink)',
              fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}
          >
            {msg.startsWith('✅') ? <FiCheck /> : <FiX />}
            {msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tier ID</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Configuration</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Usage Range (kL)</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Velocity Rate (M/kL)</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Effective</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Control</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Synchronizing with nodes...</td></tr>
            ) : rates.map(t => (
              <tr key={t.tier_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--bwt-blue)', fontWeight: 800 }}>#{t.tier_id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{t.tier_name}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{parseFloat(t.min_usage_m3).toFixed(0)} kL</span>
                  <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>→</span>
                  <span style={{ fontWeight: 600 }}>{t.max_usage_m3 != null ? parseFloat(t.max_usage_m3).toFixed(0) + ' kL' : 'UNLIMITED'}</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiTrendingUp color="var(--bwt-pink)" size={14} />
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>M {parseFloat(t.cost_per_m3).toFixed(2)}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>/kL</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {t.effective_date?.substring(0, 10)}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} 
                    onClick={() => startEdit(t)}
                  >
                    <FiEdit2 size={12} /> CONFIG
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '1.5rem 2rem', background: 'rgba(0, 180, 216, 0.05)', borderLeft: '4px solid var(--bwt-blue)', borderRadius: '12px', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <FiInfo size={24} color="var(--bwt-blue)" style={{ marginTop: '0.2rem' }} />
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--bwt-blue)', fontSize: '1rem' }}>Strategic Notice</strong>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Changes to billing rates will only apply to bills generated <em>after</em> the effective date. 
            Existing invoices are immutable and will not be recalculated.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showAdd || editingId ? (
          <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card glass-panel" 
              style={{ width: '100%', maxWidth: '600px', padding: '3rem', border: '1px solid var(--bwt-blue-glow)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                 <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{editingId ? 'Configure Tier' : 'Initialize New Tier'}</h3>
                 <button onClick={() => { setShowAdd(false); setEditingId(null); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><FiX size={24} /></button>
              </div>
              
              <form onSubmit={handleSave}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>TIER IDENTIFIER (NAME)</label>
                  <input style={inputStyle} value={form.tierName} onChange={e => setForm({...form, tierName: e.target.value})} required />
                </div>
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>MIN USAGE (kL)</label>
                    <input type="number" style={inputStyle} value={form.minUsage} onChange={e => setForm({...form, minUsage: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>MAX USAGE (kL, ∞ = BLANK)</label>
                    <input type="number" style={inputStyle} value={form.maxUsage} onChange={e => setForm({...form, maxUsage: e.target.value})} />
                  </div>
                </div>
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>VELOCITY RATE (M / kL)</label>
                    <input type="number" step="0.01" style={inputStyle} value={form.costPerM3} onChange={e => setForm({...form, costPerM3: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>EFFECTIVE DATE</label>
                    <input type="date" style={inputStyle} value={form.effectiveDate} onChange={e => setForm({...form, effectiveDate: e.target.value})} required />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1.25rem', borderRadius: '12px' }} disabled={saving}>
                    {saving ? 'SYNCING...' : (editingId ? 'UPDATE CONFIG' : 'DEPLOY TIER')}
                  </button>
                  <button type="button" className="btn-outline" style={{ flex: 1, padding: '1.25rem', borderRadius: '12px' }} onClick={() => { setShowAdd(false); setEditingId(null); }}>
                    ABORT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default BillingRates;
