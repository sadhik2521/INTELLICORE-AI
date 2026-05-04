import React from 'react';
import { ChevronRight, Info, Award, Users, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', zIndex: 10, backgroundColor: 'var(--surface-container-lowest)',
        borderBottom: '1px solid var(--surface-variant)'
      }}>
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
          <ChevronRight size={24} color="var(--outline)" style={{ transform: 'rotate(180deg)' }} />
        </div>
        <h2 className="headline-lg maya-text" style={{ 
          margin: '0 auto', fontSize: '20px', fontWeight: 800, transform: 'translateX(-12px)', letterSpacing: '-0.5px'
        }}>ABOUT MAYA</h2>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Logo & Intro */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '24px', 
            background: 'var(--primary-gradient)', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(46, 91, 255, 0.4)'
          }}>
            <Info size={40} color="#fff" />
          </div>
          <h1 className="headline-xl" style={{ fontSize: '28px', marginBottom: '8px' }}>Maya Cognition</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '15px', lineHeight: '1.6' }}>
            Empowering the next generation of human intelligence through advanced neural interfaces and generative AI.
          </p>
        </div>

        {/* Mission Card */}
        <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--surface-variant)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Award size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Our Mission</h3>
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', lineHeight: '1.6' }}>
            To bridge the gap between human curiosity and complex information, making high-level reasoning and creative generation accessible to everyone, everywhere.
          </p>
        </div>

        {/* Links */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--surface-variant)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--surface-variant)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Globe size={20} color="var(--outline)" />
              <span style={{ fontSize: '15px' }}>Official Website</span>
            </div>
            <ChevronRight size={18} color="var(--outline)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--surface-variant)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Mail size={20} color="var(--outline)" />
              <span style={{ fontSize: '15px' }}>Contact Support</span>
            </div>
            <ChevronRight size={18} color="var(--outline)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Users size={20} color="var(--outline)" />
              <span style={{ fontSize: '15px' }}>Community Forum</span>
            </div>
            <ChevronRight size={18} color="var(--outline)" />
          </div>
        </div>

        {/* Socials */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '10px' }}>
          <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'var(--surface-container-high)', cursor: 'pointer' }}>
            <Globe size={20} color="var(--on-surface)" />
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default About;
