import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pre-fill email if coming from registration
    if (location.state?.fromRegister && location.state?.registeredEmail) {
      setForm(f => ({ ...f, email: location.state.registeredEmail }));
      setSuccessMsg('Account created successfully! Please sign in to continue.');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.token, data.user);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Panel */}
      <div className="auth-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiZap size={22} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.1 }}>PixelWind Technologies</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>SecureAssess Platform</div>
          </div>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
          Welcome Back
        </h2>
        <p style={{ opacity: 0.85, fontSize: '1rem', lineHeight: 1.7, maxWidth: 340 }}>
          Sign in to access your personalized exam dashboard and begin your assessment.
        </p>
        <div style={{ marginTop: 56, padding: '20px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>Exam Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem', opacity: 0.9 }}>
            <div>Duration: <strong>40 Minutes</strong></div>
            <div>Total Questions: <strong>40</strong></div>
            <div>Topics: <strong>HTML, CSS, Digital Marketing</strong></div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Sign In</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter your credentials to access the exam portal</p>
          </div>

          {successMsg && (
            <div className="alert alert-success">
              <FiCheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{successMsg}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <FiAlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingLeft: 38, paddingRight: 36 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            New student?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
