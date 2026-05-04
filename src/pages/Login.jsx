import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { GoogleSignUpButton } from '../components/RealOAuthButtons';
// Removed AnimatedBackground import

const Login = () => {
  const navigate = useNavigate();
  const { login, oauthLogin, isAuthLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await oauthLogin(googleData);
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
      background: 'transparent',
    }}>

      <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
        <h1 className="headline-xl" onClick={() => navigate('/')} style={{ color: 'var(--primary)', marginBottom: '8px', cursor: 'pointer' }}>MAYA COGNITION</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
          {t('welcomeBack')}
        </p>
      </div>

      {/* Profile Preview (Visible when Google account is selected) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%',
          border: `2px dashed ${googleData?.picture ? 'var(--primary)' : 'var(--outline-variant)'}`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)',
          boxShadow: googleData?.picture ? '0 0 20px rgba(46,91,255,0.2)' : 'none'
        }}>
          {googleData?.picture ? (
            <img 
              src={googleData.picture} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--outline-variant)' }}>
              <div style={{ fontSize: '24px', fontWeight: 600 }}>?</div>
            </div>
          )}
        </div>
        {googleData && (
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>{googleData.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--outline)' }}>Linked via Google</div>
          </div>
        )}
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label className="label-md" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>
            {t('emailAddress')}
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-field"
            required
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label className="label-md" style={{ color: 'var(--on-surface-variant)' }}>{t('password')}</label>
            <span style={{ color: 'var(--primary)', fontSize: '12px', cursor: 'pointer' }}>{t('forgot')}</span>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
              style={{ letterSpacing: !showPassword && password ? '2px' : 'normal', paddingRight: '48px' }}
              required
            />
            <div 
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', right: '16px', cursor: 'pointer', 
                color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center',
                zIndex: 5, padding: '4px'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>

        {error && <div style={{ color: 'var(--error)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <button type="submit" className="btn-primary" disabled={isAuthLoading} style={{ marginTop: '8px', padding: '16px', opacity: isAuthLoading ? 0.7 : 1 }}>
          {isAuthLoading ? 'Processing...' : t('signIn')} {!isAuthLoading && <ArrowRight size={20} />}
        </button>
      </form>

      <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--outline-variant)' }} />
        <span className="label-md" style={{ color: 'var(--on-surface-variant)' }}>{t('orContinueWith')}</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--outline-variant)' }} />
      </div>

      {googleData ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: '1px solid var(--primary)', backgroundColor: 'rgba(46,91,255,0.05)' }}>
          {googleData.picture && (
            <img 
              src={googleData.picture} 
              alt="" 
              style={{ width: '28px', height: '28px', borderRadius: '50%' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
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
        letterSpacing: '1px'
      }}>
        © 2026 Maya Cognition Systems Inc.
      </div>
    </div>
  );
};

export default Login;
