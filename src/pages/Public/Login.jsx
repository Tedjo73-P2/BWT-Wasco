import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.role === 'admin') navigate('/admin');
      else if (res.role === 'manager') navigate('/manager');
      else navigate('/customer');
    } else {
      setError(res.error || 'Identity verification failed. Please try again.');
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Operator <span className="gradient-text">Logon</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure access to BWT WASCO Grid</p>
      </div>

      {error && (
        <div style={{ 
          background: 'rgba(255, 66, 66, 0.1)', 
          color: '#ff4242', 
          padding: '0.75rem 1rem', 
          borderRadius: '10px', 
          marginBottom: '1.5rem', 
          fontSize: '0.85rem',
          border: '1px solid rgba(255, 66, 66, 0.2)',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Identifier</label>
          <div style={{ position: 'relative' }}>
             <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
             <input 
                type="text" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email or Account Number"
                style={{ paddingLeft: '3rem', width: '100%' }}
              />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Key</label>
          <div style={{ position: 'relative' }}>
             <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
             <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '3rem', width: '100%' }}
              />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <Link to="#" style={{ fontSize: '0.85rem', color: 'var(--bwt-blue)', fontWeight: 600 }}>Reset Password?</Link>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', height: '52px' }}>
          Ignition Start <FiArrowRight />
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          New Operator? <Link to="/register" style={{ color: 'var(--bwt-pink)', fontWeight: 600 }}>Apply for Access</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
