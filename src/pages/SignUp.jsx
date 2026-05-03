import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleSignUpButton } from '../components/RealOAuthButtons';
// Removed AnimatedBackground import

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, isAuthLoading } = useAuth();
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [googleLinked, setGoogleLinked] = useState(false); // tracks if Google populated the form

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  // Called when Google auth succeeds — populate fields with Google data
  const handleGoogleData = ({ name, email: gEmail, picture }) => {
    setUsername(name);
    setEmail(gEmail);
    setGoogleLinked(true);
    setError('');
    
    // Set URL immediately for instant preview
    if (picture) {
      setAvatar(picture);
      
      // Attempt background conversion to base64 for persistence
      fetch(picture, { mode: 'no-cors' })
        .then(() => {
          // Note: no-cors prevents reading the blob, so we might just stick with the URL
          // If the server handles persistence, we'll use the URL. 
          // For now, setting it directly ensures the UI looks correct.
        })
        .catch(() => {});
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password) {
      setError("All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) { setError(passwordError); return; }

    // Pass avatar (base64 or null) to signup
    const res = await signup(username, email, password, avatar);
    if (res.success) {
      navigate('/chat');
    } else {
      setError(res.error || 'Failed to create account');
    }
  };

  const inputStyle = {
    width: '100%', border: 'none', background: 'transparent',
    color: '#101415', fontSize: '16px', outline: 'none', fontFamily: 'Inter'
  };
  const inputWrapStyle = { backgroundColor: '#ffffff', borderRadius: '4px', padding: '12px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '32px 24px', position: 'relative', overflowY: 'auto', background: 'transparent' }}>

      <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '24px' }}>
        <h1 className="headline-xl" onClick={() => navigate('/')} style={{ color: 'var(--primary)', marginBottom: '8px', cursor: 'pointer' }}>INTELLICORE AI</h1>
        <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>Create an account to get started.</p>
      </div>

      {/* Profile Picture Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {/* Show avatar if uploaded manually or fetched from Google */}
        <div
          onClick={() => !googleLinked && fileInputRef.current.click()}
          style={{
            width: '90px', height: '90px', borderRadius: '50%',
            cursor: googleLinked ? 'default' : 'pointer',
            border: `2px dashed ${avatar ? 'var(--primary)' : 'var(--outline-variant)'}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            overflow: 'hidden', position: 'relative', backgroundColor: 'rgba(255,255,255,0.05)',
            transition: 'border-color 0.2s',
            boxShadow: avatar ? '0 0 20px rgba(46,91,255,0.2)' : 'none'
          }}
        >
          {avatar ? (
            <img 
              src={avatar} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('broken-img');
              }}
            />
          ) : (
            <>
              <Camera size={24} color="var(--outline-variant)" />
              <span style={{ fontSize: '10px', color: 'var(--outline-variant)', marginTop: '4px', textAlign: 'center', padding: '0 4px' }}>Upload Photo</span>
            </>
          )}
        </div>

        {avatar && (
          <button
            type="button"
            onClick={() => { setAvatar(null); if (googleLinked) setGoogleLinked(false); }}
            style={{
              marginTop: '8px', background: 'none', border: 'none',
              color: 'var(--outline)', cursor: 'pointer', fontSize: '12px',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}
          >
            <X size={12} /> Remove photo
          </button>
        )}
        {!googleLinked && <p style={{ fontSize: '11px', color: 'var(--outline)', marginTop: '6px' }}>Optional · Max 5MB</p>}
      </div>

      <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label className="label-md" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>USERNAME</label>
          <div style={inputWrapStyle}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
          </div>
        </div>

        <div>
          <label className="label-md" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>EMAIL ADDRESS</label>
          <div style={inputWrapStyle}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          </div>
        </div>

        <div>
          <label className="label-md" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: '8px' }}>PASSWORD</label>
          <div style={inputWrapStyle}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, letterSpacing: '2px' }} required />
          </div>
        </div>

        {error && <div style={{ color: 'var(--error)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <button type="submit" className="btn-primary" disabled={isAuthLoading} style={{ marginTop: '4px', padding: '16px', opacity: isAuthLoading ? 0.7 : 1 }}>
          {isAuthLoading ? 'Creating Account...' : 'Sign Up'} {!isAuthLoading && <ArrowRight size={20} />}
        </button>
      </form>

      {/* Single divider above Google button */}
      <div style={{ margin: '28px 0 16px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--outline-variant)' }} />
        <span className="label-md" style={{ color: 'var(--on-surface-variant)' }}>OR CONTINUE WITH</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--outline-variant)' }} />
      </div>

      {/* Google button: populates fields if not yet linked, otherwise auto-completes signup */}
      {googleLinked ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: '1px solid var(--primary)', backgroundColor: 'rgba(46,91,255,0.05)' }}>
          {avatar && (
            <img 
              src={avatar} 
              alt="" 
              style={{ width: '28px', height: '28px', borderRadius: '50%' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: 'var(--on-surface)' }}>{username}</div>
            <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{email}</div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>✓ Google</span>
        </div>
      ) : (
        <GoogleSignUpButton onGoogleData={handleGoogleData} setError={setError} />
      )}

      <div style={{ textAlign: 'center', marginTop: '28px', marginBottom: '40px', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
        Already have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign In</span>
      </div>

    </div>
  );
};

export default SignUp;
