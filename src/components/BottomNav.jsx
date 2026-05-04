import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Cloud, User, Sparkles } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'chat', path: '/chat', icon: MessageSquare, label: 'Chat' },
    { id: 'explore', path: '/explore', icon: Cloud, label: 'Explore' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '6px 0',
      backgroundColor: 'var(--surface)',
      backdropFilter: 'blur(15px)',
      borderTop: '1px solid var(--outline)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 50, // Higher z-index to ensure it's clickable
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: '6px 16px',
              borderRadius: '16px',
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              position: 'relative'
            }}
          >
            <Icon 
              size={24} 
              style={{
                filter: isActive ? 'drop-shadow(0 0 10px var(--primary))' : 'none',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }} 
            />
            {isActive && (
              <span style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
