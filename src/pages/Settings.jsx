import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Bell, Shield, Globe, HelpCircle, Check, X, Lock, ShieldCheck, UserCheck, FileText, Scale, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' }
  ];

  const currentLangName = languages.find(l => l.code === language)?.name || 'English';

  const settingGroups = [
    {
      title: t('application'),
      items: [
        { id: 'notif', icon: Bell, label: t('notifications'), type: 'toggle', value: notifications, setter: setNotifications },
        { id: 'lang', icon: Globe, label: t('language'), value: currentLangName, action: () => setShowLangModal(true) },
      ]
    },
    {
      title: t('aiData'),
      items: [
        { id: 'priv', icon: Shield, label: t('privacySecurity'), action: () => setShowPrivacyModal(true) },
      ]
    },
    {
      title: t('support'),
      items: [
        { id: 'help', icon: HelpCircle, label: t('helpCenter'), action: () => navigate('/contact') },
        { id: 'terms', icon: Shield, label: t('termsOfService'), action: () => setShowTermsModal(true) },
      ]
    }
  ];

  const privacyItems = [
    { icon: Lock, title: t('dataEncryption'), desc: t('dataEncryptionDesc') },
    { icon: ShieldCheck, title: t('neuralPrivacy'), desc: t('neuralPrivacyDesc') },
    { icon: UserCheck, title: t('accountSecurity'), desc: t('accountSecurityDesc') }
  ];

  const termsItems = [
    { icon: UserCheck, title: t('userConduct'), desc: t('userConductDesc') },
    { icon: Fingerprint, title: t('dataUsage'), desc: t('dataUsageDesc') },
    { icon: Scale, title: t('intellectualProperty'), desc: t('intellectualPropertyDesc') }
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
        }}>{t('appSettings')}</h2>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {settingGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="label-md" style={{ color: 'var(--on-surface-variant)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginLeft: '4px' }}>{group.title}</span>
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--outline)', backgroundColor: 'var(--surface-bright)' }}>
              {group.items.map((item, iIdx) => (
                <div key={iIdx} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 20px', borderBottom: iIdx === group.items.length - 1 ? 'none' : '1px solid var(--outline)',
                  cursor: 'pointer', transition: 'background 0.2s'
                }}
                onClick={() => {
                  if (item.type === 'toggle') item.setter(!item.value);
                  if (item.action) item.action();
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <item.icon size={20} color="var(--primary)" />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--on-surface)' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.type === 'toggle' ? (
                      <div style={{ 
                        width: '48px', height: '26px', borderRadius: '13px', 
                        backgroundColor: item.value ? 'var(--primary)' : 'var(--outline)',
                        position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: item.value ? '0 0 12px rgba(1, 41, 112, 0.2)' : 'none'
                      }}>
                        <div style={{ 
                          width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
                          position: 'absolute', top: '3px', left: item.value ? '25px' : '3px',
                          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                    ) : (
                      <>
                        {item.value && <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)', fontWeight: 500 }}>{item.value}</span>}
                        <ChevronRight size={18} color="var(--outline)" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '10px', opacity: 0.6 }}>
          <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', fontWeight: 700, letterSpacing: '0.5px' }}>MAYA COGNITION v2.5.0</p>
          <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLangModal && (
        <div style={{ 
          position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'flex-end' 
        }}>
          <div className="glass-card" style={{ 
            width: '100%', padding: '24px', borderRadius: '32px 32px 0 0', 
            backgroundColor: 'var(--surface)', border: '1px solid var(--outline)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.4s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{t('selectLanguage')}</h3>
              <div onClick={() => setShowLangModal(false)} style={{ cursor: 'pointer', padding: '4px', background: 'var(--accent)', borderRadius: '50%' }}>
                <X size={20} color="var(--on-surface-variant)" />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {languages.map((lang) => (
                <div 
                  key={lang.code}
                  onClick={() => { changeLanguage(lang.code); setShowLangModal(false); }}
                  style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 20px', borderRadius: '20px', 
                    backgroundColor: language === lang.code ? 'var(--accent)' : 'var(--surface-bright)',
                    border: '1px solid',
                    borderColor: language === lang.code ? 'var(--primary)' : 'var(--outline)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--on-surface)' }}>{lang.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{lang.native}</div>
                  </div>
                  {language === lang.code && <Check size={20} color="var(--primary)" />}
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={() => setShowLangModal(false)} style={{ width: '100%', marginTop: '24px' }}>{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Privacy & Security Modal */}
      {showPrivacyModal && (
        <div style={{ 
          position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'flex-end' 
        }}>
          <div className="glass-card" style={{ 
            width: '100%', padding: '32px 24px', borderRadius: '32px 32px 0 0', 
            backgroundColor: 'var(--surface)', border: '1px solid var(--outline)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.4s ease-out',
            maxHeight: '85vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'var(--accent)', borderRadius: '12px' }}>
                  <Shield size={24} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{t('privacyTitle')}</h3>
              </div>
              <div onClick={() => setShowPrivacyModal(false)} style={{ cursor: 'pointer', padding: '6px', background: 'var(--accent)', borderRadius: '50%' }}>
                <X size={20} color="var(--on-surface-variant)" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {privacyItems.map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '20px', border: '1px solid var(--outline)', backgroundColor: 'var(--surface-bright)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <item.icon size={20} color="var(--primary)" />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>{item.title}</h4>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => setShowPrivacyModal(false)} style={{ width: '100%', marginTop: '32px', height: '56px' }}>{t('close')}</button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal (Liquid Glass) */}
      {showTermsModal && (
        <div style={{ 
          position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'flex-end' 
        }}>
          <div className="glass-card" style={{ 
            width: '100%', padding: '32px 24px', borderRadius: '32px 32px 0 0', 
            backgroundColor: 'var(--surface)', border: '1px solid var(--outline)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', animation: 'slideUp 0.4s ease-out',
            maxHeight: '85vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'var(--accent)', borderRadius: '12px' }}>
                  <FileText size={24} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{t('termsTitle')}</h3>
              </div>
              <div onClick={() => setShowTermsModal(false)} style={{ cursor: 'pointer', padding: '6px', background: 'var(--accent)', borderRadius: '50%' }}>
                <X size={20} color="var(--on-surface-variant)" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {termsItems.map((item, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '20px', border: '1px solid var(--outline)', backgroundColor: 'var(--surface-bright)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <item.icon size={20} color="var(--primary)" />
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--on-surface)' }}>{item.title}</h4>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => setShowTermsModal(false)} style={{ width: '100%', marginTop: '32px', height: '56px' }}>{t('close')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
