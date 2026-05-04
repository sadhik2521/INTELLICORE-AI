import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Paperclip, Mic, Send, Copy, Sparkles, Cpu, Zap, Activity, X, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Chat = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollContainerRef = useRef(null);
  const menuRef = useRef(null);
  const historyRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      scrollContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: messages.length > 5 ? 'smooth' : 'auto'
      });
    }
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

  const rawApiUrl = import.meta.env.VITE_API_URL || 'https://intellicore-ai-ro40.onrender.com';
  let API_URL = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : null;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (!import.meta.env.VITE_API_URL) API_URL = 'http://localhost:3001';
  }

  const getLocalChats = () => {
    try { return JSON.parse(localStorage.getItem(`mayaChats_${user?.id}`) || '[]'); }
    catch { return []; }
  };
  const saveLocalChats = (msgs) => {
    localStorage.setItem(`mayaChats_${user?.id}`, JSON.stringify(msgs));
  };

  const fetchChats = async () => {
    if (!user) return;
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/chats/${user.id}`);
        const data = await res.json();
        setMessages(data);
        return;
      } catch (e) { console.warn('Backend unavailable'); }
    }
    setMessages(getLocalChats());
  };

  const clearChats = async () => {
    if (!user) return;
    setMessages([]);
    setShowHistory(false);
    localStorage.removeItem(`mayaChats_${user.id}`);
    if (API_URL) {
      try { await fetch(`${API_URL}/api/chats/${user.id}`, { method: 'DELETE' }); }
      catch (e) { console.error('Failed to clear backend chats'); }
    }
  };

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi')) return "Hello! 👋 I'm MAYA, your neural assistant. How can I help you today?";
    return "I've analyzed your query and I'm ready to assist. Would you like me to elaborate further on this topic?";
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const newMessage = { user_id: user.id, message: input, sender: 'user', timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    if (API_URL) {
      try {
        await fetch(`${API_URL}/api/chats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage)
        });
        setTimeout(() => { fetchChats(); setIsTyping(false); }, 1500);
        return;
      } catch (e) { console.warn('Backend unavailable'); }
    }

    saveLocalChats(updatedMessages);
    setTimeout(() => {
      const aiMessage = { user_id: user.id, message: getAIResponse(input), sender: 'ai', timestamp: new Date().toISOString() };
      const withAI = [...updatedMessages, aiMessage];
      setMessages(withAI);
      saveLocalChats(withAI);
      setIsTyping(false);
    }, 1500);
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
        <div className="menu-trigger" onClick={() => setShowHistory(!showHistory)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Menu size={24} color="var(--on-surface)" />
        </div>
        <h2 className="headline-lg maya-text" onClick={() => { setMessages([]); setInput(''); }} style={{
          margin: 0, fontSize: '20px', cursor: 'pointer', fontWeight: 800, letterSpacing: '-0.5px'
        }}>MAYA COGNITION</h2>
        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            overflow: 'hidden', border: '1px solid var(--outline)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'var(--surface-bright)', cursor: 'pointer'
          }}
        >
          {user?.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 700 }}>{user?.name?.[0]?.toUpperCase()}</span>}
        </div>

        {/* Profile Menu Dropdown */}
        {showProfileMenu && (
          <div ref={menuRef} className="glass-card" style={{
            position: 'absolute', top: '70px', right: '20px', width: '240px',
            padding: '24px', zIndex: 100, borderRadius: '24px'
          }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 12px', border: '2px solid var(--primary)', padding: '2px' }}>
                {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '24px', fontWeight: 800 }}>{user?.name?.[0]}</div>}
              </div>
              <h3 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>{user?.name}</h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '12px', margin: 0 }}>{user?.email}</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate('/profile')} style={{ width: '100%', marginBottom: '8px', padding: '10px' }}>{t('profile')}</button>
            <button className="btn-secondary" onClick={() => { logout(); navigate('/'); }} style={{ width: '100%', color: 'var(--error)', borderColor: 'rgba(223, 21, 41, 0.2)' }}>{t('logOut')}</button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div 
        ref={scrollContainerRef}
        style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '160px', position: 'relative' }}
      >
        {messages.length === 0 ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <div className="pulse" style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'var(--accent)', filter: 'blur(30px)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }} />
              <div style={{ width: '100px', height: '100px', borderRadius: '28px', background: 'var(--brand-gradient)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 15px 35px rgba(1, 41, 112, 0.2)', transform: 'rotate(-5deg)' }}>
                <Cpu size={50} color="#fff" />
              </div>
              <div className="floating" style={{ position: 'absolute', top: '-15px', right: '-20px' }}>
                <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--surface-bright)', border: '1px solid var(--outline)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
                  <Sparkles size={18} color="var(--primary)" />
                </div>
              </div>
              <div className="floating" style={{ position: 'absolute', top: '20px', left: '-50px', animationDelay: '0.5s' }}>
                <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--surface-bright)', border: '1px solid var(--outline)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
                  <Zap size={22} color="var(--primary)" />
                </div>
              </div>
              <div className="floating" style={{ position: 'absolute', bottom: '-10px', right: '-40px', animationDelay: '1s' }}>
                <div style={{ padding: '8px', borderRadius: '12px', background: 'var(--surface-bright)', border: '1px solid var(--outline)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
                  <Cloud size={22} color="#012970" />
                </div>
              </div>
            </div>
            <h1 className="headline-xl maya-text" style={{ fontWeight: 800, marginBottom: '16px' }}>{t('howCanIHelp')}</h1>
            <p className="body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '300px', marginBottom: '40px' }}>
              {t('mayaAssistant')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              {[t('writeCode'), t('explainAI'), t('brainstorm')].map(item => (
                <button key={item} className="btn-secondary" onClick={() => setInput(item)} style={{ padding: '10px 24px', fontSize: '14px' }}>{item}</button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div className={msg.sender === 'user' ? "glass-card" : ""} style={{
                  padding: '16px 20px', borderRadius: '20px',
                  background: msg.sender === 'user' ? 'var(--surface-bright)' : 'var(--brand-gradient)',
                  color: msg.sender === 'user' ? 'var(--on-surface)' : '#ffffff',
                  border: msg.sender === 'user' ? '1px solid var(--outline)' : 'none',
                  boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(0,0,0,0.05)' : '0 8px 25px rgba(1, 41, 112, 0.2)'
                }}>
                  {msg.sender === 'ai' && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', opacity: 0.8 }}><Activity size={14} /><span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>MAYA</span></div>}
                  <div style={{ fontSize: '15px', lineHeight: '1.6' }}>{msg.message}</div>
                </div>
              </div>
            ))}
            {isTyping && <div style={{ alignSelf: 'flex-start', padding: '12px 20px', borderRadius: '20px', background: 'var(--brand-gradient)', color: '#fff', display: 'flex', gap: '8px', alignItems: 'center', opacity: 0.8 }}><Zap size={16} className="pulse" /> <span style={{ fontSize: '13px' }}>{t('processing')}</span></div>}
          </div>
        )}
      </div>

      {/* Input Bar Section */}
      <div style={{
        position: 'absolute', bottom: '60px', left: 0, width: '100%',
        padding: '20px 24px', backgroundColor: 'transparent', zIndex: 15
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Paperclip size={20} color="var(--on-surface-variant)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
            <input
              type="text"
              placeholder={t('askMaya')}
              className="input-field"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              style={{ paddingLeft: '48px', paddingRight: '48px', height: '56px', borderRadius: '28px' }}
            />
            <Mic size={20} color="var(--on-surface-variant)" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
          </div>
          <button onClick={handleSend} className="btn-primary" style={{ width: '56px', height: '56px', borderRadius: '28px', padding: 0, minWidth: '56px' }}>
            <Send size={22} />
          </button>
        </div>
      </div>

      {/* History Drawer */}
      <div 
        ref={historyRef}
        style={{
          position: 'absolute', top: 0, left: 0, height: '100%', width: '300px',
          backgroundColor: 'var(--surface)', backdropFilter: 'blur(20px)', zIndex: 100,
          borderRight: '1px solid var(--outline)', transform: showHistory ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', padding: '32px 24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 className="headline-lg maya-text" style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{t('history')}</h3>
          <X size={24} color="var(--on-surface-variant)" onClick={() => setShowHistory(false)} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.length === 0 ? <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>{t('noHistoryYet')}</p> : 
            [...new Set(messages.filter(m => m.sender === 'user').map(m => m.message))].reverse().map((msg, i) => (
              <div key={i} onClick={() => { setInput(msg); setShowHistory(false); }} className="btn-secondary" style={{ padding: '12px 16px', fontSize: '13px', borderRadius: '12px', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid var(--outline)' }}>{msg}</div>
            ))
          }
        </div>
        <button onClick={clearChats} className="btn-secondary" style={{ marginTop: '20px', color: 'var(--error)', borderColor: 'rgba(223, 21, 41, 0.2)' }}>{t('clearChat')}</button>
        
        <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.5 }}>
          <p style={{ fontSize: '10px', color: 'var(--on-surface-variant)', fontWeight: 600 }}>© 2026 Maya Cognition Systems Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
