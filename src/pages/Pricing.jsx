import React from 'react';
import { ChevronLeft, Check, Zap, Star, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for exploring the future of AI.',
      features: ['100 messages / day', 'Basic AI Engine', 'Standard response time', 'Community support'],
      buttonText: 'Current Plan',
      isCurrent: true,
      color: 'var(--outline)'
    },
    {
      name: 'Pro',
      price: '₹1,599',
      description: 'Unlock full potential with advanced reasoning.',
      features: ['Unlimited messages', 'Neural Engine v4.0', 'Priority response time', 'Advanced coding help', 'Early access to features'],
      buttonText: 'Upgrade to Pro',
      isCurrent: false,
      isPopular: true,
      color: 'var(--primary)'
    },
    {
      name: 'Enterprise',
      price: '₹3,999',
      description: 'Tailored solutions for teams and businesses.',
      features: ['Everything in Pro', 'Custom AI fine-tuning', 'Dedicated account manager', 'SLA & Uptime guarantee', 'API access'],
      buttonText: 'Contact Sales',
      isCurrent: false,
      color: 'var(--secondary)'
    }
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
        }}>{t('pricingPlans')}</h2>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '120px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <div className="pulse" style={{ position: 'absolute', inset: -15, background: 'var(--accent)', filter: 'blur(20px)', borderRadius: '50%', zIndex: -1 }} />
            <Zap size={40} color="var(--primary)" />
          </div>
          <h1 className="headline-xl" style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 800 }}>Choose your power</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', fontWeight: 500 }}>Simple pricing for extraordinary intelligence.</p>
        </div>

        {plans.map((plan, idx) => (
          <div key={idx} className="glass-card" style={{ 
            padding: '28px', borderRadius: '32px', position: 'relative',
            border: plan.isPopular ? `2px solid var(--primary)` : '1px solid var(--outline)',
            backgroundColor: plan.isPopular ? 'var(--surface-bright)' : 'var(--surface-bright)',
            boxShadow: plan.isPopular ? '0 20px 40px rgba(1, 41, 112, 0.1)' : 'none',
            overflow: 'hidden', transition: 'transform 0.3s ease'
          }}>
            {plan.isPopular && (
              <div style={{ 
                position: 'absolute', top: '16px', right: '-35px', 
                backgroundColor: 'var(--primary)', color: '#fff',
                fontSize: '10px', fontWeight: 800, padding: '4px 35px',
                transform: 'rotate(45deg)', letterSpacing: '1px'
              }}>POPULAR</div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>{plan.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginTop: '6px', fontWeight: 500 }}>{plan.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-1px' }}>{plan.price}</span>
                {plan.price !== 'Free' && <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>/mo</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: plan.isCurrent ? 'var(--outline)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color={plan.isCurrent ? 'var(--on-surface-variant)' : 'var(--primary)'} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--on-surface)', fontWeight: 500 }}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={plan.isPopular ? 'btn-primary' : 'btn-secondary'} 
              style={{ width: '100%', height: '56px', borderRadius: '20px', fontSize: '16px', fontWeight: 700, opacity: plan.isCurrent ? 0.7 : 1 }}
              disabled={plan.isCurrent}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}

        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', backgroundColor: 'transparent', border: '1px dashed var(--outline)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
            <Shield size={20} color="var(--primary)" />
            <span style={{ fontSize: '14px', color: 'var(--on-surface)', fontWeight: 600 }}>Secure payments via Razorpay</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: 0 }}>Prices are in INR. GST included where applicable.</p>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: 'center', marginTop: '12px', opacity: 0.6 }}>
          <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
