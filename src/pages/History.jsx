import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Trash2, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = () => {
    if (!user) return;
    try {
      const chats = JSON.parse(localStorage.getItem(`mayaChats_${user.id}`) || '[]');
      // Filter for unique user messages to represent 'Conversations'
      const userMessages = chats.filter(m => m.sender === 'user');
      
      // Get unique titles (messages)
      const uniqueChats = [];
      const seen = new Set();
      
      for (const msg of userMessages.reverse()) {
        if (!seen.has(msg.message)) {
          uniqueChats.push({
            id: msg.timestamp || Math.random(),
            title: msg.message,
            date: new Date(msg.timestamp || Date.now()).toLocaleDateString(),
            time: new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          seen.add(msg.message);
        }
      }
      setHistoryItems(uniqueChats);
    } catch (e) {
      console.error('Failed to load history');
    }
  };

  const clearHistory = () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem(`mayaChats_${user.id}`);
      setHistoryItems([]);
    }
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
        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} color="var(--on-surface)" />
        </div>
        <h2 className="headline-lg maya-text" style={{ 
          margin: 0, fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px' 
        }}>COGNITION HISTORY</h2>
        <div style={{ width: '24px' }} /> {/* Spacing */}
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {historyItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <Clock size={64} color="var(--outline)" style={{ marginBottom: '16px' }} />
            <p className="body-md">No records found</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '8px' }}>
              <span className="label-md" style={{ color: 'var(--on-surface-variant)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>RECENT CONVERSATIONS</span>
            </div>

            {historyItems.map((item) => (
              <div 
                key={item.id} 
                className="glass-card" 
                onClick={() => navigate('/chat')}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px', borderRadius: '20px', backgroundColor: 'var(--surface-bright)', border: '1px solid var(--outline)',
                  cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              >
                <div style={{ padding: '12px', background: 'var(--accent)', borderRadius: '14px' }}>
                  <MessageSquare size={20} color="var(--primary)" />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{item.date}</span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--outline)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{item.time}</span>
                  </div>
                </div>
                <ChevronLeft size={18} color="var(--outline)" style={{ transform: 'rotate(180deg)', opacity: 0.5 }} />
              </div>
            ))}

            <div style={{ marginTop: '32px' }}>
              <button 
                onClick={clearHistory}
                className="btn-secondary" 
                style={{ width: '100%', color: 'var(--error)', borderColor: 'rgba(223, 21, 41, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Trash2 size={16} /> Clear All History
              </button>
            </div>
          </>
        )}

        {/* Copyright */}
        <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.6 }}>
          <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default History;
