import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Globe, LogIn, Compass, ArrowRight,
  Sun, Moon, ShieldCheck, Zap, Cpu, Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleLangMenu = () => setShowLangMenu(!showLangMenu);

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '24px',
      position: 'relative',
      overflowY: 'auto',
      backgroundColor: 'var(--background)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative', marginBottom: '10px' }}>
        <h1 className="headline-lg maya-text" onClick={() => navigate('/')} style={{
          margin: 0, fontSize: '20px', cursor: 'pointer', fontWeight: 800, letterSpacing: '-0.5px'
        }}>MAYA COGNITION</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Selector */}
          <div
            onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--on-surface-variant)', cursor: 'pointer', padding: '8px',
              borderRadius: '8px', backgroundColor: 'var(--surface)'
            }}
          >
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={toggleLangMenu}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--on-surface-variant)',
                fontSize: '14px', cursor: 'pointer', padding: '8px', borderRadius: '8px',
                backgroundColor: showLangMenu ? 'var(--accent)' : 'transparent'
              }}
            >
              <span>{language.toUpperCase()}</span>
              <Globe size={16} />
            </div>

            {showLangMenu && (
              <div className="glass-card" style={{
                position: 'absolute', top: '45px', right: '0',
                display: 'flex', flexDirection: 'column', gap: '4px',
                padding: '8px', zIndex: 20, minWidth: '120px'
              }}>
                {['en', 'hi', 'te'].map((lang) => (
                  <div
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    style={{
                      padding: '10px 12px', cursor: 'pointer', borderRadius: '8px',
                      backgroundColor: language === lang ? 'var(--accent)' : 'transparent',
                      color: language === lang ? 'var(--primary)' : 'var(--on-background)',
                      fontWeight: language === lang ? 600 : 400
                    }}
                  >
                    {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Telugu'}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Typographic/Icon Hero (Replacing the image) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Pulsing circles behind the icon */}
          <div className="pulse" style={{
            position: 'absolute', width: '240px', height: '240px', borderRadius: '50%',
            backgroundColor: 'var(--accent)', filter: 'blur(40px)', zIndex: -1
          }} />
          <div className="pulse" style={{
            position: 'absolute', width: '180px', height: '180px', borderRadius: '50%',
            backgroundColor: 'rgba(65, 84, 241, 0.1)', filter: 'blur(30px)', animationDelay: '1s', zIndex: -1
          }} />

          <div style={{
            width: '180px', height: '180px', borderRadius: '48px',
            background: 'linear-gradient(135deg, #012970 0%, #013289 100%)',
            display: 'flex',
            justifyContent: 'center', alignItems: 'center',
            boxShadow: '0 25px 50px rgba(1, 41, 112, 0.25)',
            transform: 'rotate(-5deg)',
            zIndex: 2
          }}>
            <Cpu size={90} color="#ffffff" />
          </div>

          {/* Floating badges around the main icon */}
          <div className="floating" style={{ position: 'absolute', top: '-25px', right: '-40px', animationDelay: '0.5s' }}>
            <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <Sparkles size={28} color="var(--primary)" />
            </div>
          </div>
          <div className="floating" style={{ position: 'absolute', bottom: '-15px', left: '-40px', animationDelay: '1.5s' }}>
            <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <Activity size={28} color="var(--success)" />
            </div>
          </div>
        </div>
      </div>

      {/* Typography & Actions */}
      <div style={{
        textAlign: 'center',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        paddingBottom: '20px',
        marginTop: '0px' /* Centered normally */
      }}>
        <div>
          <h2 className="headline-xl maya-text" style={{ marginBottom: '16px', fontWeight: 800, fontSize: '36px' }}>{t('experienceFuture')}</h2>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)', padding: '0 8px', fontSize: '18px' }}>
            {t('unlockPower')}
          </p>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', height: '64px', fontSize: '20px' }}
          onClick={() => navigate('/signup')}
        >
          {t('getStarted')} <ArrowRight size={24} />
        </button>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            className="btn-secondary"
            style={{ flex: 1, height: '56px', fontSize: '16px' }}
            onClick={() => navigate('/login')}
          >
            <LogIn size={20} /> {t('signIn')}
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, height: '56px', fontSize: '16px' }}
            onClick={() => navigate('/explore')}
          >
            <Compass size={20} /> {t('explore')}
          </button>
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '50px', backgroundColor: 'var(--accent)',
            fontSize: '12px', color: 'var(--primary)', fontWeight: 600
          }}>
            <Zap size={14} />
            {t('neuralEngine')}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '50px', backgroundColor: 'rgba(46, 202, 106, 0.1)',
            fontSize: '12px', color: 'var(--success)', fontWeight: 600
          }}>
            <ShieldCheck size={14} />
            {t('privacyEncrypted')}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', marginTop: '0px', paddingBottom: '0px', opacity: 0.5 }}>
          <p style={{ fontSize: '10px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
