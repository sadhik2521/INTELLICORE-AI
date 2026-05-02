import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Globe, LogIn, Compass, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
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
      overflowY: 'auto'
    }}>
      {/* Background graphic effect */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-20%',
        width: '140%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(46,91,255,0.15) 0%, rgba(16,20,21,0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative' }}>
        <h1 className="headline-lg" onClick={() => navigate('/')} style={{ color: 'var(--primary)', margin: 0, cursor: 'pointer' }}>INTELLICORE AI</h1>
        
        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={toggleLangMenu}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--on-surface-variant)', 
              fontSize: '14px', cursor: 'pointer', padding: '8px', borderRadius: '8px',
              backgroundColor: showLangMenu ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            <span>{language.toUpperCase()}</span>
            <Globe size={16} />
          </div>

          {showLangMenu && (
            <div className="glass-card" style={{
              position: 'absolute', top: '40px', right: '0', 
              display: 'flex', flexDirection: 'column', gap: '8px',
              padding: '8px', zIndex: 20, minWidth: '120px'
            }}>
              <div 
                onClick={() => selectLanguage('en')} 
                style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', backgroundColor: language === 'en' ? 'rgba(46,91,255,0.2)' : 'transparent' }}
              >
                English
              </div>
              <div 
                onClick={() => selectLanguage('hi')} 
                style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', backgroundColor: language === 'hi' ? 'rgba(46,91,255,0.2)' : 'transparent' }}
              >
                Hindi
              </div>
              <div 
                onClick={() => selectLanguage('te')} 
                style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', backgroundColor: language === 'te' ? 'rgba(46,91,255,0.2)' : 'transparent' }}
              >
                Telugu
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center graphic */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(46,91,255,0.8), rgba(87,27,193,0.8))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 0 60px rgba(46,91,255,0.4)',
          position: 'relative'
        }}>
           <div style={{
             position: 'absolute',
             width: '100%',
             height: '100%',
             borderRadius: '50%',
             border: '1px solid rgba(255,255,255,0.2)',
             boxSizing: 'border-box'
           }} className="pulsing-aura" />
           <Sparkles size={64} color="#ffffff" />
        </div>
      </div>

      {/* Typography & Actions */}
      <div style={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 className="headline-xl" style={{ marginBottom: '16px' }}>{t('experienceFuture')}</h2>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)', padding: '0 16px' }}>
            {t('unlockPower')}
          </p>
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%' }}
          onClick={() => navigate('/signup')}
        >
          {t('getStarted')} <ArrowRight size={20} />
        </button>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            className="btn-secondary" 
            style={{ flex: 1 }}
            onClick={() => navigate('/login')}
          >
            <LogIn size={18} /> {t('signIn')}
          </button>
          <button 
            className="btn-secondary" 
            style={{ flex: 1 }}
            onClick={() => navigate('/explore')}
          >
            <Compass size={18} /> {t('explore')}
          </button>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--outline-variant)',
            fontSize: '12px', color: 'var(--on-surface)'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            {t('neuralEngine')}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--outline-variant)',
            fontSize: '12px', color: 'var(--on-surface)'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
            {t('privacyEncrypted')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
