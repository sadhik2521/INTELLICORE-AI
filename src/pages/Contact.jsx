import React, { useState } from 'react';
import { ChevronLeft, Mail, MessageCircle, HelpCircle, Send, Phone, MapPin, CheckCircle, Headphones, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactOptions = [
    { icon: Mail, label: t('email'), value: 'support@mayacognition.ai', color: 'var(--primary)' },
    { icon: MessageCircle, label: t('liveChat'), value: '5 min response', color: 'var(--secondary)' },
    { icon: Phone, label: t('callback'), value: 'Request call', color: 'var(--primary)' }
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
        }}>{t('contactTitle')}</h2>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
            <div className="pulse" style={{ position: 'absolute', inset: -15, background: 'var(--accent)', filter: 'blur(20px)', borderRadius: '50%', zIndex: -1 }} />
            <Headphones size={48} color="var(--primary)" />
          </div>
          <h1 className="headline-xl" style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 800 }}>{t('hereToHelp')}</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', fontWeight: 500, maxWidth: '280px', margin: '0 auto' }}>{t('neuralSupport')}</p>
        </div>

        {/* Quick Contact Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {contactOptions.map((opt, i) => (
            <div key={i} className="glass-card" style={{ 
              padding: '20px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              borderRadius: '24px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)'
            }}>
              <div style={{ padding: '10px', background: 'var(--accent)', borderRadius: '14px' }}>
                <opt.icon size={20} color={opt.color} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--on-surface)' }}>{opt.label}</span>
                <span style={{ fontSize: '9px', color: 'var(--on-surface-variant)', fontWeight: 500 }}>{opt.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="glass-card" style={{ padding: '32px 24px', borderRadius: '32px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                <div className="pulse" style={{ position: 'absolute', inset: -10, background: 'rgba(46, 202, 106, 0.2)', borderRadius: '50%' }} />
                <CheckCircle size={64} color="var(--success)" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>{t('messageSent')}</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.6' }}>{t('thankYou')}</p>
              <button className="btn-secondary" onClick={() => setSubmitted(false)} style={{ marginTop: '32px', width: '100%', borderRadius: '16px' }}>{t('sendAnother')}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="label-md" style={{ color: 'var(--on-surface-variant)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>{t('fullName')}</span>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={t('placeholderName')}
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ height: '56px', borderRadius: '16px', padding: '0 20px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="label-md" style={{ color: 'var(--on-surface-variant)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>{t('emailAddress')}</span>
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder={t('placeholderEmail')}
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ height: '56px', borderRadius: '16px', padding: '0 20px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span className="label-md" style={{ color: 'var(--on-surface-variant)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>{t('message')}</span>
                <textarea 
                  className="input-field" 
                  placeholder={t('placeholderMessage')}
                  rows="4" 
                  required
                  style={{ resize: 'none', borderRadius: '16px', padding: '20px' }}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', height: '56px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>
                <Send size={20} /> {t('send')}
              </button>
            </form>
          )}
        </div>

        {/* Feature/Help Preview */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px dashed var(--outline)', backgroundColor: 'transparent' }}>
          <div style={{ padding: '12px', background: 'var(--accent)', borderRadius: '14px' }}>
            <Sparkles size={24} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Instant Answers</h4>
            <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: '4px 0 0 0' }}>Explore Maya features while you wait.</p>
          </div>
          <div onClick={() => navigate('/explore')} style={{ cursor: 'pointer', padding: '8px', background: 'var(--accent)', borderRadius: '50%' }}>
            <ChevronLeft size={20} color="var(--primary)" style={{ transform: 'rotate(180deg)' }} />
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', marginTop: '12px', opacity: 0.6 }}>
          <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
