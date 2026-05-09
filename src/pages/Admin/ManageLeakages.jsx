import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../App';
import { FiAlertTriangle, FiRefreshCw, FiMapPin, FiClock, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ManageLeakages = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const isManager = user?.role === 'manager';

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/leakages');
      setReports(res.data);
    } catch (err) {
      setError('❌ Deployment link failed. Unable to retrieve leakage telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (isManager) return; // Protocol safeguard
    setUpdating(id);
    try {
      await axios.patch(`/leakages/${id}/status`, { status: newStatus });
      fetchReports();
    } catch (err) {
      alert('❌ Authorization failure or network timeout.');
    } finally {
      setUpdating(null);
    }
  };

  const getUrgencyColor = (u) => {
    if (u === 'High') return 'var(--bwt-pink)';
    if (u === 'Medium') return '#FFAB00';
    return 'var(--bwt-blue)';
  };

  const getStatusColor = (s) => {
    if (s === 'Resolved') return '#00FFC2';
    if (s === 'In Progress') return 'var(--bwt-blue)';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <FiActivity className="gradient-text" size={24} />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Leakage <span className="gradient-text">Telemetry</span></h2>
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              {isManager ? 'Strategic observation of national grid integrity nodes.' : 'Mission-critical maintenance and incident resolution.'}
           </p>
        </div>
        <button 
          className="btn-outline" 
          onClick={fetchReports} 
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.5rem', borderRadius: '12px' }}
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> {loading ? 'SYNCING...' : 'REFRESH GRID'}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card glass-panel" 
            style={{ color: 'var(--bwt-pink)', border: '1px solid rgba(255, 0, 122, 0.2)', marginBottom: '2rem', background: 'rgba(255, 0, 122, 0.05)' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Node / ID</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Entity</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Incident Intelligence</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Priority</th>
              <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Grid Status</th>
              {!isManager && <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Resolution</th>}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.report_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ fontWeight: '800', color: 'var(--bwt-blue)', fontSize: '1.1rem' }}>
                    LKG-{r.report_id.toString().padStart(5, '0')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                     <FiClock size={12} /> {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ fontWeight: '700', color: 'white' }}>{r.full_name || 'Anonymous Node'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--bwt-blue)', fontWeight: 600, marginTop: '0.2rem' }}>{r.district || 'GLOBAL GRID'}</div>
                </td>
                <td style={{ padding: '1.5rem', maxWidth: '350px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                     <FiMapPin size={14} color="var(--bwt-pink)" /> {r.location}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                    {r.description}
                  </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <span style={{ 
                    color: getUrgencyColor(r.urgency), 
                    background: `${getUrgencyColor(r.urgency)}15`,
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    border: `1px solid ${getUrgencyColor(r.urgency)}33`
                  }}>
                    {r.urgency}
                  </span>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(r.status), boxShadow: `0 0 10px ${getStatusColor(r.status)}` }}></div>
                     <span style={{ color: getStatusColor(r.status), fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                       {r.status}
                     </span>
                  </div>
                </td>
                {!isManager && (
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <select 
                      value={r.status} 
                      onChange={(e) => handleStatusChange(r.report_id, e.target.value)}
                      disabled={updating === r.report_id}
                      style={{ 
                         backgroundColor: '#1a1a2e', 
                         color: 'white', 
                         border: '1px solid rgba(255,255,255,0.1)', 
                         padding: '0.5rem 0.75rem', 
                         borderRadius: '8px', 
                         fontSize: '0.8rem',
                         outline: 'none',
                         cursor: 'pointer'
                      }}
                    >
                      <option value="Pending" style={{ background: '#1a1a2e' }}>PENDING</option>
                      <option value="In Progress" style={{ background: '#1a1a2e' }}>IN PROGRESS</option>
                      <option value="Resolved" style={{ background: '#1a1a2e' }}>RESOLVED</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
            {reports.length === 0 && !loading && (
              <tr>
                <td colSpan={isManager ? 5 : 6} style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <FiCheckCircle size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                  <p style={{ margin: 0, fontSize: '1.1rem' }}>National grid integrity confirmed. No active leakages detected.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLeakages;
