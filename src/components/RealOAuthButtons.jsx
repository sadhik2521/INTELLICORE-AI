import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Used on Login page — directly signs in after Google auth
export const GoogleLoginButton = ({ setError }) => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        const randomPwd = Math.random().toString(36).slice(-8) + "A1";
        const res = await signup(userInfo.name, userInfo.email, randomPwd, userInfo.picture || null);
        if (!res.success && res.error === 'Email already exists') {
          navigate('/chat');
        } else if (res.success) {
          navigate('/chat');
        } else {
          setError(res.error);
        }
      } catch (err) {
        setError("Failed to fetch Google profile info.");
      }
      setLoading(false);
    },
    onError: () => setError("Google Login Failed.")
  });

  return (
    <>
      {loading && <Spinner />}
      <GoogleBtn onClick={googleLogin} />
    </>
  );
};

// Used on Sign Up page — populates form fields with Google data instead of auto-signing up
export const GoogleSignUpButton = ({ onGoogleData, setError }) => {
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        // Pass data back to the parent form to populate fields
        onGoogleData({
          name: userInfo.name || '',
          email: userInfo.email || '',
          picture: userInfo.picture || null,
        });
      } catch (err) {
        setError("Failed to fetch Google profile info.");
      }
      setLoading(false);
    },
    onError: () => setError("Google Sign In Failed.")
  });

  return (
    <>
      {loading && <Spinner />}
      <GoogleBtn onClick={googleLogin} />
    </>
  );
};

// Shared spinner overlay
const Spinner = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  }}>
    <div style={{
      padding: '24px 32px', backgroundColor: 'var(--surface-container)',
      borderRadius: '12px', textAlign: 'center'
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: `4px solid var(--primary)`, borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite', margin: '0 auto 16px'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p>Connecting to Google...</p>
    </div>
  </div>
);

// Shared Google button UI
const GoogleBtn = ({ onClick }) => (
  <button
    type="button"
    className="btn-secondary"
    style={{ width: '100%', gap: '12px', padding: '14px', justifyContent: 'center' }}
    onClick={() => onClick()}
  >
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    Continue with Google
  </button>
);

// Keep default export for backward compat (used on Login page)
const RealOAuthButtons = ({ setError }) => <GoogleLoginButton setError={setError} />;
export default RealOAuthButtons;
