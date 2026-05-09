import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiSearch, FiFilter, FiEdit2, FiPlus, FiX, FiCheck, FiMail, FiPhone, FiMapPin, FiShield } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [districts, setDistricts] = useState([]);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', district: '', physicalAddress: '', password: '', email: '' });
  const [processing, setProcessing] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const [custRes, distRes] = await Promise.all([
        axios.get('/customers', { params: { search, district } }),
        axios.get('/customers/districts/all'),
      ]);
      setCustomers(custRes.data);
      setDistricts(distRes.data);
    } catch {
      setError('❌ Synchronization failure. Node registry unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [search, district]);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      fullName: customer.full_name,
      phone: customer.phone_number || '',
      district: customer.district || '',
      physicalAddress: customer.physical_address || '',
      email: customer.email || '',
      password: '' 
    });
    setShowAdd(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (editingCustomer) {
        await axios.put(`/customers/${editingCustomer.account_number}`, form);
      } else {
        await axios.post('/auth/register', form);
      }
      setShowAdd(false);
      setEditingCustomer(null);
      setForm({ fullName: '', phone: '', district: '', physicalAddress: '', password: '', email: '' });
      fetchCustomers();
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <FiUsers className="gradient-text" size={24} />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Node <span className="gradient-text">Registry</span></h2>
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Global directory of national water grid endpoints.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => { setEditingCustomer(null); setForm({ fullName: '', phone: '', district: '', physicalAddress: '', password: '', email: '' }); setShowAdd(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: '14px' }}
        >
          <FiPlus /> Deploy New Node
        </button>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
           <input
             type="text"
             placeholder="Search by name, account, email..."
             style={{ ...inputStyle, paddingLeft: '3rem' }}
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
           <FiSearch style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
        </div>
        <div style={{ position: 'relative', width: '250px' }}>
           <select style={selectStyle} value={district} onChange={e => setDistrict(e.target.value)}>
             <option value="" style={{ background: '#1a1a2e' }}>All Districts</option>
             {districts.map(d => <option key={d.district_id} value={d.name} style={{ background: '#1a1a2e' }}>{d.name}</option>)}
           </select>
           <FiFilter style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
        </div>
      </div>

      {error && <div className="card glass-panel" style={{ color: 'var(--bwt-pink)', border: '1px solid rgba(255, 0, 122, 0.2)', marginBottom: '2rem', background: 'rgba(255, 0, 122, 0.05)' }}>{error}</div>}

      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Node ID</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Entity Name</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sector / Region</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Communication</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Control</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving encrypted records...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No node signatures detected.</td></tr>
            ) : customers.map(c => (
              <tr key={c.account_number} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--bwt-blue)' }}>{c.account_number}</td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>{c.full_name}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ color: 'var(--bwt-pink)', fontWeight: 600, fontSize: '0.85rem' }}>{c.district || 'GLOBAL'}</div>
                   <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{c.physical_address || 'Unregistered Location'}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.85rem' }}>
                      <FiMail size={12} color="var(--bwt-blue)" /> {c.email}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      <FiPhone size={12} /> {c.phone_number || '—'}
                   </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleEdit(c)}
                    className="btn-outline"
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FiEdit2 size={12} /> CONFIG
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
              style={{ width: '100%', maxWidth: '700px', padding: '3rem', border: '1px solid var(--bwt-blue-glow)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                 <div>
                    <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{editingCustomer ? 'Reconfigure Node' : 'Initialize New Node'}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{editingCustomer ? `Updating terminal ${editingCustomer.account_number}` : 'Deploying a new citizen node to the national grid.'}</p>
                 </div>
                 <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><FiX size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>FULL LEGAL ENTITY NAME</label>
                    <input style={inputStyle} value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>COMMUNICATION EMAIL</label>
                    <input type="email" style={inputStyle} value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                </div>
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>CONTACT TELEMETRY (PHONE)</label>
                    <input style={inputStyle} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>{editingCustomer ? 'RE-ENCRYPT ACCESS (OPTIONAL)' : 'INITIAL ACCESS ENCRYPTION'}</label>
                    <input type="password" style={inputStyle} placeholder={editingCustomer ? "Keep blank to retain current" : "Set master password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editingCustomer} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>GRID SECTOR (DISTRICT)</label>
                  <select style={selectStyle} value={form.district} onChange={e => setForm({...form, district: e.target.value})} required>
                    <option value="" style={{ background: '#1a1a2e' }}>Select Sector</option>
                    {districts.map(d => <option key={d.district_id} value={d.name} style={{ background: '#1a1a2e' }}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>GEOSPATIAL COORDINATES (PHYSICAL ADDRESS)</label>
                  <textarea style={{ ...inputStyle, resize: 'none' }} rows="3" value={form.physicalAddress} onChange={e => setForm({...form, physicalAddress: e.target.value})} />
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1.25rem', borderRadius: '12px' }} disabled={processing}>
                    {processing ? 'TRANSMITTING...' : (editingCustomer ? <><FiCheck /> SYNC CHANGES</> : <><FiPlus /> DEPLOY NODE</>)}
                  </button>
                  <button type="button" className="btn-outline" style={{ flex: 1, padding: '1.25rem', borderRadius: '12px' }} onClick={() => setShowAdd(false)}>
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

export default ManageCustomers;
