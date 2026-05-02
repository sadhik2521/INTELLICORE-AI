import React from 'react';
import { Menu, Moon, Sparkles, History, LogOut, ChevronRight, ChevronDown, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', zIndex: 10, backgroundColor: 'var(--surface-container-lowest)',
        borderBottom: '1px solid var(--surface-variant)'
      }}>
        <Menu size={24} color="var(--outline)" />
        <h2 className="headline-lg" onClick={() => navigate('/')} style={{ color: 'var(--primary)', margin: 0, fontSize: '20px', cursor: 'pointer' }}>INTELLICORE AI</h2>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--electric-blue)', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user?.avatar
            ? <img src={user.avatar} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            : <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{user?.name?.[0]?.toUpperCase() || ''}</span>
          }
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Profile Card */}
        <div className="glass-card" style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          padding: '32px 20px', borderRadius: '24px', backgroundColor: 'var(--surface-container-high)', border: 'none'
        }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--electric-blue)', padding: '2px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.avatar
                ? <img src={user.avatar} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                : <span style={{ fontSize: '28px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>{user?.name?.[0]?.toUpperCase() || ''}</span>
              }
            </div>
            <div style={{
              position: 'absolute', bottom: '-4px', right: '-12px',
              backgroundColor: 'var(--primary-container)', color: '#fff',
              fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px',
              border: '2px solid var(--surface-container-high)'
            }}>{t('pro')}</div>
          </div>
          <h3 className="headline-lg" style={{ fontSize: '20px', marginBottom: '4px' }}>{user?.name || 'Alex Chen'}</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>{user?.email || 'alex.chen@intellicore.io'}</p>
        </div>

        {/* Theme Preferences */}
        <div className="glass-card" style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px', borderRadius: '16px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--surface-variant)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <Moon size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>{t('themePreferences')}</div>
              <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{t('darkModeActive')}</div>
            </div>
          </div>
          <div style={{ 
            display: 'flex', backgroundColor: 'var(--surface-container-high)', borderRadius: '24px', padding: '4px' 
          }}>
            <div style={{ padding: '6px 12px', borderRadius: '20px', color: 'var(--on-surface-variant)' }}>
              <Sun size={16} />
            </div>
            <div style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'var(--electric-blue)', color: '#fff', boxShadow: '0 0 10px rgba(46,91,255,0.4)' }}>
              <Moon size={16} />
            </div>
          </div>
        </div>

        {/* AI Model Selection */}
        <div className="glass-card" style={{ 
          display: 'flex', flexDirection: 'column', gap: '16px',
          padding: '20px', borderRadius: '16px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--surface-variant)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <Sparkles size={20} color="var(--secondary)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>{t('aiModelSelection')}</div>
              <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>IntelliCore-4 Turbo (Stable)</div>
            </div>
          </div>
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', border: '1px solid var(--electric-blue)', borderRadius: '8px',
            backgroundColor: 'rgba(46,91,255,0.05)'
          }}>
            <span style={{ fontSize: '14px' }}>IntelliCore-4 Turbo (Stable)</span>
            <ChevronDown size={16} color="var(--outline)" />
          </div>
        </div>

        {/* History */}
        <div className="glass-card" style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px', borderRadius: '16px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--surface-variant)', cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <History size={20} color="var(--outline)" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>{t('history')}</div>
              <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{t('activeSessions')}</div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--outline)" />
        </div>

        {/* Log Out */}
        <div className="glass-card" onClick={handleLogout} style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px', borderRadius: '16px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--surface-variant)', cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(244,67,54,0.1)', borderRadius: '12px' }}>
              <LogOut size={20} color="#ff6b6b" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#ff6b6b' }}>{t('logOut')}</div>
              <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{t('securelyEndSession')}</div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--outline)" />
        </div>

        {/* Delete Account */}
        <div style={{ textAlign: 'center', marginTop: '16px', color: 'var(--outline)', fontSize: '14px', letterSpacing: '1px', cursor: 'pointer' }}>
          {t('deleteAccount')}
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
