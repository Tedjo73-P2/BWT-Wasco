import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAlertTriangle, FiRefreshCw, FiMapPin, FiClock, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const MyLeakages = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/leakages');
      setReports(res.data);
    } catch {
      setError('❌ Failed to retrieve leakage reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <FiActivity className="gradient-text" size={24} />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>My <span className="gradient-text">Reports</span></h2>
           </div>
           <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Tracking your submitted grid integrity incidents.</p>
        </div>
        <button 
          className="btn-outline" 
          onClick={fetchData} 
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.5rem', borderRadius: '12px' }}
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> SYNC
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

      <div className="grid-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving telemetry...</div>
        ) : reports.length === 0 ? (
          <div className="card glass-panel" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FiCheckCircle size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
            <p style={{ margin: 0, fontSize: '1.1rem' }}>No incident reports found in your node history.</p>
          </div>
        ) : reports.map((r) => (
          <motion.div 
            key={r.report_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card glass-panel"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem' }}
          >
            <div style={{ flex: 1 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--bwt-blue)', fontSize: '1.1rem' }}>LKG-{r.report_id.toString().padStart(5, '0')}</span>
                  <span style={{ 
                    color: getUrgencyColor(r.urgency), 
                    background: `${getUrgencyColor(r.urgency)}15`,
                    padding: '0.3rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    border: `1px solid ${getUrgencyColor(r.urgency)}33`
                  }}>
                    {r.urgency}
                  </span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <FiMapPin size={14} color="var(--bwt-pink)" /> {r.location}
               </div>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                  {r.description}
               </p>
            </div>
            
            <div style={{ textAlign: 'right', minWidth: '150px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(r.status), boxShadow: `0 0 10px ${getStatusColor(r.status)}` }}></div>
                  <span style={{ color: getStatusColor(r.status), fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    {r.status}
                  </span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <FiClock size={12} /> {new Date(r.created_at).toLocaleDateString()}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyLeakages;
