import React from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, Shield, Cpu, Layers } from 'lucide-react';

const Explore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '16px 20px', zIndex: 10, backgroundColor: 'rgba(16, 20, 21, 0.8)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--surface-variant)'
      }}>
        <ArrowLeft size={24} color="var(--outline)" onClick={handleBack} style={{ cursor: 'pointer' }} />
        <h2 className="headline-lg" style={{ color: 'var(--primary)', margin: '0 auto', fontSize: '20px', transform: 'translateX(-12px)' }}>Explore</h2>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: user ? '80px' : '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: '8px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
             <Sparkles size={48} color="var(--secondary)" className="pulsing-aura" style={{ borderRadius: '50%' }} />
          </div>
          <h1 className="headline-xl" onClick={() => navigate('/')} style={{ fontSize: '28px', marginBottom: '8px', cursor: 'pointer', color: 'var(--primary)' }}>INTELLICORE AI</h1>
          <p className="body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Discover the next generation of conversational intelligence and productivity.
          </p>
        </div>

        {/* Section 1: AI Capabilities */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(46,91,255,0.1)', borderRadius: '8px' }}>
              <Cpu size={24} color="var(--primary)" />
            </div>
            <h3 className="headline-lg" style={{ fontSize: '18px', margin: 0 }}>AI Capabilities</h3>
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.6' }}>
            INTELLICORE leverages our advanced Neural Engine v4.0 to understand complex queries, generate programming code, write creative content, and synthesize large amounts of data in milliseconds.
          </p>
        </div>

        {/* Section 2: Key Features */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(208,188,255,0.1)', borderRadius: '8px' }}>
               <Layers size={24} color="var(--secondary)" />
            </div>
            <h3 className="headline-lg" style={{ fontSize: '18px', margin: 0 }}>Key Features</h3>
          </div>
          <ul style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Contextual Memory:</strong> Remembers your past interactions for seamless follow-ups.</li>
            <li><strong>Code Execution:</strong> Generates and formats code blocks natively.</li>
            <li><strong>Voice Input:</strong> Speak naturally instead of typing your queries.</li>
            <li><strong>Multi-Language Support:</strong> Instantly switch between English, Hindi, and Telugu.</li>
          </ul>
        </div>

        {/* Section 3: How It Works */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(184,195,255,0.1)', borderRadius: '8px' }}>
              <Zap size={24} color="var(--primary)" />
            </div>
            <h3 className="headline-lg" style={{ fontSize: '18px', margin: 0 }}>How It Works</h3>
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.6' }}>
            Simply type or speak your request into the chat interface. INTELLICORE processes your intent through secure, cloud-based neural pathways and returns highly accurate, context-aware responses instantly.
          </p>
        </div>

        {/* Section 4: Benefits */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(87,27,193,0.1)', borderRadius: '8px' }}>
              <Shield size={24} color="var(--secondary)" />
            </div>
            <h3 className="headline-lg" style={{ fontSize: '18px', margin: 0 }}>Benefits</h3>
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.6' }}>
            Boost your productivity, solve problems faster, and brainstorm effortlessly. All your data is privacy-encrypted, ensuring a safe and secure digital companion experience.
          </p>
        </div>

      </div>

      {user && <BottomNav />}
    </div>
  );
};

export default Explore;
