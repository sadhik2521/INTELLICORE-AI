import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, Sparkles, Zap, Shield, Cpu, Layers } from 'lucide-react';

const Explore = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    if (user) navigate('/chat');
    else navigate('/');
  };

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
        <div onClick={handleBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="var(--on-surface)" />
        </div>
        <h2 className="headline-lg maya-text" style={{ 
          margin: 0, fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' 
        }}>{t('exploreMaya')}</h2>
        <div style={{ width: '24px' }} />
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: user ? '120px' : '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: '8px', marginTop: '16px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
            <div className="pulse" style={{ position: 'absolute', inset: -20, background: 'var(--accent)', filter: 'blur(30px)', borderRadius: '50%', zIndex: -1 }} />
            <Sparkles size={64} color="var(--primary)" />
          </div>
          <h1 className="headline-xl maya-text" style={{ fontSize: '32px', marginBottom: '12px', fontWeight: 800 }}>MAYA COGNITION</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '300px', margin: '0 auto' }}>
            {t('discoverNext')}
          </p>
        </div>

        {/* Section 1: AI Capabilities */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '28px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--accent)', borderRadius: '14px' }}>
              <Cpu size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 800, color: 'var(--on-surface)' }}>{t('aiCapabilities')}</h3>
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            {t('aiDescription')}
          </p>
        </div>

        {/* Section 2: Key Features */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '28px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(208,188,255,0.1)', borderRadius: '14px' }}>
              <Layers size={24} color="var(--secondary)" />
            </div>
            <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 800, color: 'var(--on-surface)' }}>{t('keyFeatures')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: t('featureMemory'), desc: t('featureMemoryDesc') },
              { label: t('featureCode'), desc: t('featureCodeDesc') },
              { label: t('featureVoice'), desc: t('featureVoiceDesc') },
              { label: t('featureMultiLang'), desc: t('featureMultiLangDesc') }
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '8px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--on-surface)' }}>{f.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginTop: '2px' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: How It Works */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '28px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(184,195,255,0.1)', borderRadius: '14px' }}>
              <Zap size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 800, color: 'var(--on-surface)' }}>{t('howItWorks')}</h3>
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            {t('howItWorksDesc')}
          </p>
        </div>

        {/* Section 4: Benefits */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '28px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(87,27,193,0.1)', borderRadius: '14px' }}>
              <Shield size={24} color="var(--secondary)" />
            </div>
            <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 800, color: 'var(--on-surface)' }}>{t('benefits')}</h3>
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            {t('benefitsDesc')}
          </p>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', marginTop: '12px', opacity: 0.6 }}>
          <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Explore;
