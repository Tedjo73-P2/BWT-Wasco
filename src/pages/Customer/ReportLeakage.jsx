import { useState } from 'react';
import { useAuth } from '../../App';
import axios from 'axios';
import { FiDroplet, FiMapPin, FiAlertTriangle, FiCheck, FiNavigation, FiPlus, FiMessageSquare, FiX, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ReportLeakage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    urgency: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/leakages', formData);
      setSuccess(res.data);
      setFormData({ location: '', description: '', urgency: 'Medium' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report. Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: '#1a1a2e',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1.25rem center',
    backgroundSize: '14px'
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
           <FiDroplet size={64} color="var(--bwt-blue)" />
           <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ position: 'absolute', top: -10, right: -10, background: 'var(--bwt-pink)', padding: '5px', borderRadius: '50%' }}
           >
              <FiCheck size={20} color="white" />
           </motion.div>
        </div>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>LEAK <span className="gradient-text">REPORTED</span></h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
           Conserving the national reserve. Our response team has been dispatched.
        </p>
        
        <div style={{ 
           background: 'rgba(0, 180, 216, 0.1)', 
           border: '1px solid rgba(0, 180, 216, 0.2)', 
           padding: '1.5rem', 
           borderRadius: '16px', 
           marginBottom: '2.5rem' 
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--bwt-blue)', marginBottom: '0.5rem' }}>
             Tracking Ticket ID
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'monospace', color: 'white' }}>
             #{success.ticketNumber || 'TK-' + Math.floor(Math.random()*90000)}
          </div>
        </div>
        
        <button className="btn-primary" onClick={() => setSuccess(null)} style={{ padding: '1rem 2rem', borderRadius: '12px' }}>
          File New Incident
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <FiAlertTriangle className="gradient-text" size={24} />
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: 0 }}>Leakage <span className="gradient-text">Protocol</span></h2>
         </div>
         <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Critical asset protection. Help us monitor and maintain the national water grid.
         </p>
      </div>

      <div className="card glass-panel" style={{ padding: '3rem' }}>
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: 'var(--bwt-pink)', background: 'rgba(255, 0, 122, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255, 0, 122, 0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <FiX /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
             <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
                   <FiUser size={14} /> REPORTING NODE
                </label>
                <input type="text" value={user?.accountNumber || 'GUEST-NODE'} disabled
                   style={{ ...inputStyle, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' }} />
             </div>
             <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
                   <FiAlertTriangle size={14} /> INCIDENT URGENCY
                </label>
                <select style={selectStyle} value={formData.urgency} onChange={e => setFormData({ ...formData, urgency: e.target.value })}>
                  <option value="Low" style={{ background: '#1a1a2e' }}>Low — Minor Seepage</option>
                  <option value="Medium" style={{ background: '#1a1a2e' }}>Medium — Steady Stream</option>
                  <option value="High" style={{ background: '#1a1a2e' }}>High — Pipe Burst / Flooding</option>
                </select>
             </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
               <FiMapPin size={14} /> INCIDENT GEOLOCATION
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                required 
                placeholder="E.g. Main North 1, Near Pioneer Mall"
                style={{ ...inputStyle, paddingLeft: '3rem' }}
                value={formData.location} 
                onChange={e => setFormData({ ...formData, location: e.target.value })} 
              />
              <FiNavigation style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
               <FiMessageSquare size={14} /> MISSION INTEL
            </label>
            <textarea 
              rows="4" 
              required 
              placeholder="Provide detailed visual confirmation of the leak..."
              style={{ ...inputStyle, resize: 'none' }}
              value={formData.description} 
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }} disabled={loading}>
            {loading ? 'TRANSMITTING...' : <><FiPlus /> DEPLOY INCIDENT REPORT</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportLeakage;
