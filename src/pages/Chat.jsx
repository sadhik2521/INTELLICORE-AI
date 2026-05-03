import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Paperclip, Mic, Send, Copy, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import BottomNav from '../components/BottomNav';
import AnimatedBackground from '../components/AnimatedBackground';

const Chat = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (historyRef.current && !historyRef.current.contains(event.target) && !event.target.closest('.menu-trigger')) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use env variable for deployed backend (Render), fallback to localhost for dev
  let rawApiUrl = import.meta.env.VITE_API_URL
    || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3001'
      : null);

  const API_URL = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : null;

  const CHAT_STORAGE_KEY = user ? `intellicore_chats_v2_${user.id}` : null;

  const getLocalChats = () => {
    if (!CHAT_STORAGE_KEY) return [];
    try { return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '[]'); }
    catch { return []; }
  };

  const saveLocalChats = (msgs) => {
    if (CHAT_STORAGE_KEY) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs));
    }
  };

  const fetchChats = async () => {
    if (!user) return;
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/chats/${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
          saveLocalChats(data); // Sync local storage with backend
          return;
        }
      } catch (e) {
        console.warn('Backend unavailable, using local chats');
      }
    }
    setMessages(getLocalChats());
  };

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) return "Hello! 👋 How can I help you today?";
    return "I've received your message and I'm processing it. Is there anything specific you'd like to know?";
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Delete all chat history permanently?')) return;
    
    // Clear UI and Local immediately
    setMessages([]);
    setShowHistory(false);
    if (CHAT_STORAGE_KEY) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
    
    // Clear Backend
    if (API_URL && user) {
      try {
        await fetch(`${API_URL}/api/chats/${user.id}`, { method: 'DELETE' });
      } catch (e) {
        console.error('Failed to clear backend history');
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const userMsg = input;
    const newMessage = { user_id: user.id, message: userMsg, sender: 'user', timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, newMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    saveLocalChats(updatedMessages);

    if (API_URL) {
      try {
        await fetch(`${API_URL}/api/chats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        });
        setTimeout(fetchChats, 1000);
        setIsTyping(false);
        return;
      } catch (e) { /* fallback to local */ }
    }

    setTimeout(() => {
      const aiMessage = { user_id: user.id, message: getAIResponse(userMsg), sender: 'ai', timestamp: new Date().toISOString() };
      const withAI = [...updatedMessages, aiMessage];
      setMessages(withAI);
      saveLocalChats(withAI);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'relative', overflow: 'hidden',
      background: 'var(--background)',
      backdropFilter: 'blur(10px)'
    }}>
      <AnimatedBackground />
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(5, 6, 8, 0.6)', zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <div className="menu-trigger" onClick={() => setShowHistory(!showHistory)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Menu size={24} color="var(--outline)" />
        </div>
        <h2 className="headline-lg" onClick={() => { setMessages([]); setInput(''); }} style={{
          background: 'linear-gradient(135deg, var(--on-surface) 30%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0, fontSize: '20px', cursor: 'pointer', fontWeight: 700
        }}>INTELLICORE AI</h2>
        <div 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            overflow: 'hidden', border: '1px solid var(--electric-blue)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)', cursor: 'pointer',
            position: 'relative'
          }}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <span style={{ color: 'var(--on-surface-variant)', fontSize: '12px', fontWeight: 600 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
        </div>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div ref={menuRef} className="glass-card" style={{
            position: 'absolute', top: '70px', right: '20px', width: '220px',
            padding: '20px', zIndex: 100, borderRadius: '16px',
            backgroundColor: 'var(--surface-container-high)', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 12px',
                border: '2px solid var(--primary)', padding: '2px'
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 700 }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <h3 style={{ color: 'var(--on-surface)', fontSize: '16px', margin: '0 0 4px 0' }}>{user?.name}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: 0 }}>{user?.email}</p>
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />
            
            <button 
              onClick={() => navigate('/profile')}
              style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: 'var(--on-surface)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', borderRadius: '8px', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              View Profile
            </button>
            <button 
              onClick={() => { localStorage.removeItem('intellicoreUser'); window.location.reload(); }}
              style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#ff4444', textAlign: 'left', cursor: 'pointer', fontSize: '14px', borderRadius: '8px', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,68,68,0.05)'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              Sign Out
            </button>
          </div>
        )}

        {/* History Sidebar */}
        <div 
          ref={historyRef}
          style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: '280px', backgroundColor: 'var(--surface-container-high)',
            backdropFilter: 'blur(20px)', zIndex: 100,
            borderRight: '1px solid rgba(255,255,255,0.05)',
            transform: showHistory ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column', padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ color: 'var(--on-surface)', fontSize: '18px', fontWeight: 700, margin: 0 }}>Search History</h3>
            <div onClick={() => setShowHistory(false)} style={{ cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
              <Menu size={20} />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.filter(m => m.sender === 'user').length === 0 ? (
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
                No history yet
              </p>
            ) : (
              [...new Set(messages.filter(m => m.sender === 'user').map(m => m.message))].reverse().map((msg, i) => (
                <div 
                  key={i}
                  onClick={() => { setInput(msg); setShowHistory(false); }}
                  style={{
                    padding: '12px 16px', borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'var(--on-surface)', fontSize: '13px',
                    cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', border: '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  {msg}
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={handleClearHistory}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '12px',
                backgroundColor: 'rgba(255,68,68,0.1)', color: '#ff4444',
                border: '1px solid rgba(255,68,68,0.2)', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600
              }}
            >
              Clear Current Chat
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: messages.length === 0 ? '0' : '140px',
        display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', textAlign: 'center', padding: '0 24px'
          }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(46,91,255,0.15), rgba(87,27,193,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px', position: 'relative',
              boxShadow: '0 0 40px rgba(46,91,255,0.1)'
            }} className="pulsing-aura">
              <Sparkles size={50} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 15px var(--primary))' }} />
            </div>
            <h1 className="headline-lg" style={{
              color: 'var(--on-surface)', marginBottom: '12px', fontSize: '26px', fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>{t('how Can I Help')}</h1>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '300px', lineHeight: '1.6', marginBottom: '32px' }}>
              I'm INTELLICORE, your advanced neural assistant. Ask me anything to get started.
            </p>

            <div style={{ width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
              <div className="glass-card" style={{
                display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '12px',
                borderRadius: '24px', backgroundColor: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.1)'
              }}>
                <Paperclip size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
                <input
                  type="text"
                  placeholder={t('askNexus')}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', color: 'var(--on-surface)',
                    fontSize: '16px', outline: 'none'
                  }}
                />
                <div onClick={handleSend} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-gradient)' }}>
                  <Send size={16} color="#fff" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                width: '100%', animation: 'fadeIn 0.3s ease-out'
              }}>
                <div className="glass-card" style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary-container)' : 'var(--surface-container-high)',
                  color: msg.sender === 'user' ? 'var(--on-primary-container)' : 'var(--on-surface)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '15px', lineHeight: '1.5' }}>{msg.message}</div>
                  <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.5, textAlign: 'right' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <div className="glass-card" style={{ padding: '12px 20px', borderRadius: '18px 18px 18px 4px' }}>
                  <div className="typing-dots" style={{ display: 'flex', gap: '4px' }}>
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input Bar (When chat active) */}
      {messages.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '80px', left: 0, right: 0,
          padding: '0 20px', zIndex: 10
        }}>
          <div className="glass-card" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px',
            borderRadius: '24px', backgroundColor: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <Paperclip size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
            <input
              type="text"
              placeholder={t('askNexus')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1, background: 'transparent', border: 'none', color: 'var(--on-surface)',
                fontSize: '16px', outline: 'none'
              }}
            />
            <div onClick={handleSend} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-gradient)', boxShadow: '0 0 15px rgba(46,91,255,0.3)' }}>
              <Send size={18} color="#fff" />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Chat;
