import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCreditCard, FiArrowRight, FiGlobe } from 'react-icons/fi';

const districts = [
  "Maseru", "Berea", "Leribe", "Butha-Buthe", "Mokhotlong",
  "Thaba-Tseka", "Qacha's Nek", "Quthing", "Mohale's Hoek", "Mafeteng"
];

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    accountNumber: '',
    fullName: '',
    email: '',
    phone: '',
    district: '',
    physicalAddress: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    try {
      await axios.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'System rejection: Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>New <span className="gradient-text">Citizen Registration</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Initialize your BWT WASCO Node</p>
      </div>

      {error && (
        <div style={{ 
          background: 'rgba(255, 66, 66, 0.1)', 
          color: '#ff4242', 
          padding: '1rem', 
          borderRadius: '12px', 
          marginBottom: '2rem',
          fontSize: '0.85rem',
          border: '1px solid rgba(255, 66, 66, 0.2)',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Account #</label>
            <div style={{ position: 'relative' }}>
              <FiCreditCard style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
              <input type="text" name="accountNumber" required onChange={handleChange} placeholder="ACC-100XX" style={{ paddingLeft: '3rem' }} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
              <input type="text" name="fullName" required onChange={handleChange} placeholder="First Last" style={{ paddingLeft: '3rem' }} />
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
              <input type="email" name="email" required onChange={handleChange} placeholder="user@bwt.com" style={{ paddingLeft: '3rem' }} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Phone</label>
            <div style={{ position: 'relative' }}>
              <FiPhone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
              <input type="tel" name="phone" required onChange={handleChange} placeholder="+266 XXXX" style={{ paddingLeft: '3rem' }} />
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Strategic District</label>
          <div style={{ position: 'relative' }}>
            <FiGlobe style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
            <select name="district" required onChange={handleChange} style={{ paddingLeft: '3rem', width: '100%', appearance: 'none', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', height: '50px' }}>
              <option value="" style={{ background: '#0A0A0F' }}>Select District Node...</option>
              {districts.map(d => <option key={d} value={d} style={{ background: '#0A0A0F' }}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Physical Address</label>
          <div style={{ position: 'relative' }}>
            <FiMapPin style={{ position: 'absolute', left: '1rem', top: '1.25rem', color: 'var(--bwt-blue)' }} />
            <textarea rows="2" name="physicalAddress" required onChange={handleChange} placeholder="Street, area, landmark..." style={{ paddingLeft: '3rem', width: '100%', paddingTop: '1rem' }}></textarea>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Security Key</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
              <input type="password" name="password" required onChange={handleChange} placeholder="••••••••" style={{ paddingLeft: '3rem' }} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Confirm Key</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--bwt-blue)' }} />
              <input type="password" name="confirmPassword" required onChange={handleChange} placeholder="••••••••" style={{ paddingLeft: '3rem' }} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', height: '56px', fontSize: '1.1rem' }} disabled={loading}>
          {loading ? 'Initializing...' : 'Confirm Registration'} <FiArrowRight />
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--bwt-blue)', fontWeight: 700 }}>Login to Terminal</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
