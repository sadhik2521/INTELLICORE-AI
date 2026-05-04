import React from 'react';
import { 
  Moon, Sparkles, LogOut, ChevronRight, 
  ChevronLeft, Sun, Info, CreditCard, Headphones, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  const navLinks = [
    { label: t('pricingPlans'), sub: 'Upgrade your experience', icon: CreditCard, path: '/pricing', color: 'var(--primary)' },
    { label: t('appSettings'), sub: 'Personalize your interface', icon: SettingsIcon, path: '/settings', color: 'var(--on-surface-variant)' },
    { label: t('contactSupport'), sub: 'Get help from our team', icon: Headphones, path: '/contact', color: 'var(--primary)' },
  ];

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', 
      backgroundColor: 'var(--background)', overflow: 'hidden' 
    }}>
      {/* Header */}
      <div style={{
        height: '64px', minHeight: '64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 20px', borderBottom: '1px solid var(--outline)',
        backgroundColor: 'var(--surface)', zIndex: 10, backdropFilter: 'blur(10px)'
      }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="var(--on-surface)" />
        </div>
        <h2 className="headline-lg maya-text" style={{ 
          margin: 0, fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' 
        }}>{t('myProfile')}</h2>
        <div style={{ width: '24px' }} />
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Profile Card */}
        <div className="glass-card" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '32px 20px', borderRadius: '28px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)'
        }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', padding: '3px', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.avatar
                ? <img src={user.avatar} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                : <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: 800 }}>{user?.name?.[0]}</div>
              }
            </div>
            <div style={{
              position: 'absolute', bottom: '-2px', right: '-8px',
              background: 'var(--brand-gradient)', color: '#fff',
              fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '14px',
              border: '2px solid var(--surface-bright)', boxShadow: '0 4px 10px rgba(1, 41, 112, 0.2)'
            }}>{t('pro')}</div>
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: 'var(--on-surface)', letterSpacing: '-0.5px' }}>{user?.name}</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', margin: 0 }}>{user?.email}</p>
        </div>

        {/* Theme Preferences */}
        <div className="glass-card" style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px', borderRadius: '24px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--accent)', borderRadius: '14px' }}>
              {theme === 'dark' ? <Moon size={22} color="var(--primary)" /> : <Sun size={22} color="var(--primary)" />}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--on-surface)' }}>{t('themePreferences')}</div>
              <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{theme === 'dark' ? t('darkModeActive') : t('lightModeActive')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', backgroundColor: 'var(--accent)', borderRadius: '28px', padding: '4px', border: '1px solid var(--outline)' }}>
            <div onClick={() => toggleTheme('light')} style={{ padding: '8px 16px', borderRadius: '24px', backgroundColor: theme === 'light' ? 'var(--primary)' : 'transparent', color: theme === 'light' ? '#fff' : 'var(--on-surface-variant)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sun size={16} />
            </div>
            <div onClick={() => toggleTheme('dark')} style={{ padding: '8px 16px', borderRadius: '24px', backgroundColor: theme === 'dark' ? 'var(--primary)' : 'transparent', color: theme === 'dark' ? '#fff' : 'var(--on-surface-variant)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Moon size={16} />
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {navLinks.map((link, i) => (
            <div key={i} className="glass-card" onClick={() => navigate(link.path)} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px', borderRadius: '24px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)', cursor: 'pointer', transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'var(--accent)', borderRadius: '14px' }}>
                  <link.icon size={22} color={link.color} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--on-surface)' }}>{link.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{link.sub}</div>
                </div>
              </div>
              <ChevronRight size={20} color="var(--outline)" />
            </div>
          ))}
        </div>

        {/* Log Out */}
        <div className="glass-card" onClick={handleLogout} style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px', borderRadius: '24px', backgroundColor: 'rgba(255, 68, 68, 0.05)', border: '1px solid rgba(255, 68, 68, 0.1)', cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(255, 68, 68, 0.1)', borderRadius: '14px' }}>
              <LogOut size={22} color="#ff6b6b" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#ff6b6b' }}>{t('logOut')}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 68, 68, 0.6)' }}>{t('securelyEndSession')}</div>
            </div>
          </div>
          <ChevronRight size={20} color="rgba(255, 68, 68, 0.3)" />
        </div>
        {/* Copyright */}
        <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.6 }}>
          <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
