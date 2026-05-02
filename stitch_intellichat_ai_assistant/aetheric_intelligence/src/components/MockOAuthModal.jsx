import React, { useState } from 'react';
import { X } from 'lucide-react';

const MockOAuthModal = ({ provider, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const mockAccounts = [
    { name: 'Alex Chen', email: 'alex.chen@intellicore.ai', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Sarah Connor', email: 'sarah.connor@gmail.com', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'David Smith', email: 'david.smith@outlook.com', avatar: 'https://i.pravatar.cc/150?img=12' },
  ];

  const handleAccountSelect = (account) => {
    setLoading(true);
    // Simulate network delay for authentication
    setTimeout(() => {
      setLoading(false);
      onSuccess(account);
    }, 1500);
  };

  const isGoogle = provider === 'Google';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: isGoogle ? '#ffffff' : '#f3f2f1',
        borderRadius: '8px', width: '90%', maxWidth: '400px',
        padding: '24px', position: 'relative',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        color: '#1a1a1a', fontFamily: 'Inter, sans-serif'
      }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              border: `4px solid ${isGoogle ? '#4285F4' : '#00a4ef'}`, 
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '16px', fontWeight: 500 }}>Authenticating with {provider}...</p>
            <style>
              {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
            </style>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isGoogle ? (
                   <div style={{ width: '24px', height: '24px', backgroundColor: '#4285F4', borderRadius: '50%' }} />
                ) : (
                   <div style={{ color: '#00a4ef', fontWeight: 'bold', fontSize: '20px' }}>Ms</div>
                )}
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>Sign in with {provider}</h3>
              </div>
              <X size={20} color="#666" style={{ cursor: 'pointer' }} onClick={onClose} />
            </div>

            <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
              Choose an account to continue to <strong>INTELLICORE AI</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mockAccounts.map((acc, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleAccountSelect(acc)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '12px',
                    borderRadius: '8px', cursor: 'pointer', border: '1px solid #e0e0e0',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img src={acc.avatar} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{acc.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{acc.email}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e0e0e0', fontSize: '12px', color: '#888', textAlign: 'center' }}>
              To continue, {provider} will share your name, email address, and profile picture with INTELLICORE AI.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MockOAuthModal;
