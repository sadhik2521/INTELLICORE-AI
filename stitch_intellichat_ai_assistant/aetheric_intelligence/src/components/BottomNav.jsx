import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Sparkles, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'chat', path: '/chat', icon: MessageSquare },
    { id: 'explore', path: '/explore', icon: Sparkles }, // Dummy explore for now
    { id: 'profile', path: '/profile', icon: User },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '16px 0',
      backgroundColor: 'var(--surface-container-lowest)',
      borderTop: '1px solid var(--surface-variant)',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      zIndex: 10,
    }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.path);
        return (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: isActive ? 'var(--electric-blue)' : 'var(--outline)',
              transition: 'color 0.3s',
              padding: '8px',
            }}
          >
            <Icon size={24} style={{
              filter: isActive ? 'drop-shadow(0 0 8px rgba(46, 91, 255, 0.6))' : 'none'
            }} />
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
