import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { GoogleSignUpButton } from '../components/RealOAuthButtons';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = () => {
  const navigate = useNavigate();
  const { login, oauthLogin } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleData, setGoogleData] = useState(null);

  const handleGoogleData = (data) => {
    setGoogleData(data);
    setEmail(data.email);
    setPassword('••••••••'); // populate password visually
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // If Google populated the form, we bypass standard password validation
    if (googleData) {
      const res = oauthLogin(googleData);
      if (res.success) {
        navigate('/chat');
      }
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/chat');
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '32px 24px',
      position: 'relative',
      background: 'rgba(8, 10, 11, 0.55)',
      backdropFilter: 'blur(2px)',
    }}>
      <AnimatedBackground />

      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '48px' }}>
        <h1 className="headline-xl" onClick={() => navigate('/')} style={{ color: 'var(--primary)', marginBottom: '16px', cursor: 'pointer' }}>INTELLICORE AI</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          {t('welcomeBack')}
        </p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label className="label-md" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>
            {t('emailAddress')}
          </label>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            padding: '12px',
          }}>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: '100%', border: 'none', background: 'transparent', 
                color: '#101415', fontSize: '16px', outline: 'none',
                fontFamily: 'Inter'
              }}
              required
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="label-md" style={{ color: 'var(--on-surface-variant)' }}>{t('password')}</label>
            <span style={{ color: 'var(--primary)', fontSize: '12px', cursor: 'pointer' }}>{t('forgot')}</span>
          </div>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            padding: '12px',
          }}>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%', border: 'none', background: 'transparent', 
                color: '#101415', fontSize: '16px', outline: 'none',
                fontFamily: 'Inter', letterSpacing: password ? '2px' : 'normal'
              }}
              required
            />
          </div>
        </div>

        {error && <div style={{ color: 'var(--error)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '16px' }}>
          {t('signIn')} <ArrowRight size={20} />
        </button>
      </form>

      <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--outline-variant)' }} />
        <span className="label-md" style={{ color: 'var(--on-surface-variant)' }}>{t('orContinueWith')}</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--outline-variant)' }} />
      </div>

      {googleData ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: '1px solid var(--primary)', backgroundColor: 'rgba(46,91,255,0.05)' }}>
          {googleData.picture && <img src={googleData.picture} alt="Google" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: 'var(--on-surface)' }}>{googleData.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{googleData.email}</div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>✓ Selected</span>
        </div>
      ) : (
        <GoogleSignUpButton onGoogleData={handleGoogleData} setError={setError} />
      )}

      <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
        {t('dontHaveAccount')} <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/signup')}>{t('signUp')}</span>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '10px',
        color: 'var(--outline)',
        letterSpacing: '2px'
      }}>
        INTELLICORE INTEGRATED SYSTEMS © 2024
      </div>
    </div>
  );
};

export default Login;
