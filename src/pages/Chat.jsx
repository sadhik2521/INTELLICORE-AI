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
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
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
        
  // Remove trailing slash if present
  const API_URL = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : null;

  useEffect(() => {
    if (API_URL) console.log('🚀 INTELLICORE CHAT API URL:', API_URL);
  }, [API_URL]);

  // localStorage helpers for chat persistence
  const getLocalChats = () => {
    try { return JSON.parse(localStorage.getItem(`intellicoreChats_${user?.id}`) || '[]'); }
    catch { return []; }
  };
  const saveLocalChats = (msgs) => {
    localStorage.setItem(`intellicoreChats_${user?.id}`, JSON.stringify(msgs));
  };

  const fetchChats = async () => {
    if (!user) return;
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/chats/${user.id}`);
        const data = await res.json();
        setMessages(data);
        return;
      } catch (e) {
        console.warn('Backend unavailable, using local chats');
      }
    }
    setMessages(getLocalChats());
  };

  // AI response templates for local fallback
  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey'))
      return "Hello! 👋 I'm INTELLICORE, your advanced neural assistant. How can I help you today?";
    if (msg.includes('code') || msg.includes('program'))
      return "I'd be happy to help with coding! Please share the specific programming task, language, or concept you'd like assistance with, and I'll provide a detailed solution.";
    if (msg.includes('explain') || msg.includes('what is'))
      return "Great question! I'll break this down for you in a clear and comprehensive way. Could you specify the topic you'd like me to explain in more detail?";
    if (msg.includes('help'))
      return "Of course! I'm here to assist you. I can help with coding, brainstorming, writing, analysis, and much more. What would you like to work on?";
    return "That's an interesting query! I've analyzed your input and I'm ready to provide a comprehensive response. As an advanced AI assistant, I can help you explore this topic further. Would you like me to elaborate on any specific aspect?";
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
        setTimeout(() => {
          fetchChats();
          setIsTyping(false);
        }, 1500);
        return;
      } catch (e) {
        console.warn('Backend unavailable, using local chat');
      }
    }

    // Fallback: localStorage + simulated AI response
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
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'relative', overflow: 'hidden',
      background: 'rgba(5, 6, 8, 0.4)',
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
        <Menu size={24} color="var(--outline)" />
        <h2 className="headline-lg" onClick={() => { setMessages([]); setInput(''); }} style={{
          background: 'linear-gradient(135deg, #fff 30%, var(--primary) 100%)',
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
            backgroundColor: 'rgba(20, 22, 25, 0.9)', border: '1px solid rgba(255,255,255,0.1)',
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
              <h3 style={{ color: '#fff', fontSize: '16px', margin: '0 0 4px 0' }}>{user?.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>{user?.email}</p>
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />
            
            <button 
              onClick={() => navigate('/profile')}
              style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer', fontSize: '14px', borderRadius: '8px', transition: 'background 0.2s' }}
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
              color: '#fff', marginBottom: '12px', fontSize: '26px', fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>{t('howCanIHelp')}</h1>
            <p className="body-md" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px', lineHeight: '1.6', marginBottom: '32px' }}>
              I'm INTELLICORE, your advanced neural assistant. Ask me anything to get started.
            </p>

            {/* Centered Input Bar */}
            <div style={{ width: '100%', maxWidth: '400px', marginBottom: '32px' }}>
              <div className="glass-card" style={{
                display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '12px',
                borderRadius: '24px', backgroundColor: 'rgba(39, 42, 44, 0.8)', border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
              }}>
                <Paperclip size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
                <input
                  type="text"
                  placeholder={t('askNexus')}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', color: '#fff',
                    fontSize: '16px', outline: 'none', padding: '12px 0',
                    fontFamily: 'Inter'
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    background: 'linear-gradient(135deg, var(--electric-blue), var(--violet))',
                    border: 'none', borderRadius: '12px', width: '40px', height: '40px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={18} color="#fff" />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {['Write code', 'Explain AI', 'Brainstorm ideas'].map((item) => (
                <div key={item} onClick={() => setInput(item)} style={{
                  padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--outline-variant)',
                  fontSize: '13px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                  backgroundColor: 'rgba(255,255,255,0.05)', transition: 'all 0.2s'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            msg.sender === 'user' ? (
              <div key={idx} style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                <div style={{
                  backgroundColor: 'var(--surface-container-high)',
                  padding: '16px', borderRadius: '20px', borderTopRightRadius: '4px',
                  color: 'var(--on-surface)', lineHeight: '1.5', border: '1px solid var(--outline-variant)'
                }}>
                  {msg.message}
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: 'var(--outline)', marginTop: '4px' }}>
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ) : (
              <div key={idx} style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
                <div style={{
                  background: 'linear-gradient(135deg, var(--electric-blue), var(--violet))',
                  padding: '20px', borderRadius: '20px', borderTopLeftRadius: '4px',
                  color: '#ffffff', lineHeight: '1.6', position: 'relative'
                }} className="ai-aura">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', opacity: 0.9 }}>
                    <Sparkles size={16} />
                    <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>INTELLICORE</span>
                  </div>

                  {msg.message.includes('def fibonacci') ? (
                    <>
                      <p style={{ marginBottom: '16px' }}>
                        {msg.message.split('def fibonacci')[0]}
                      </p>
                      <div style={{
                        backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#2d2d2d', fontSize: '12px', color: '#ccc' }}>
                          <span>fibonacci.py</span>
                          <Copy size={14} style={{ cursor: 'pointer' }} />
                        </div>
                        <pre style={{ margin: 0, padding: '16px', fontSize: '14px', overflowX: 'auto' }}>
                          <code style={{ color: '#d4d4d4' }}>
                            <span style={{ color: '#c586c0' }}>def</span> <span style={{ color: '#dcdcaa' }}>fibonacci</span>(n):{'\n'}
                            {'    '}sequence = [<span style={{ color: '#b5cea8' }}>0</span>, <span style={{ color: '#b5cea8' }}>1</span>]{'\n'}
                            {'    '}<span style={{ color: '#c586c0' }}>while</span> <span style={{ color: '#4ec9b0' }}>len</span>(sequence) {'<'} n:{'\n'}
                            {'        '}next_val = sequence[<span style={{ color: '#b5cea8' }}>-1</span>] + sequence[<span style={{ color: '#b5cea8' }}>-2</span>]{'\n'}
                            {'        '}sequence.append(next_val){'\n'}
                            {'    '}<span style={{ color: '#c586c0' }}>return</span> sequence[:n]
                          </code>
                        </pre>
                      </div>
                    </>
                  ) : (
                    <p>{msg.message}</p>
                  )}
                </div>
              </div>
            )
          ))
        )}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--electric-blue), var(--violet))',
              padding: '12px 20px', borderRadius: '20px', borderTopLeftRadius: '4px',
              display: 'flex', gap: '8px', alignItems: 'center'
            }} className="pulsing-aura">
              <Sparkles size={16} color="#fff" />
              <span style={{ color: '#fff', fontSize: '14px' }}>{t('processing')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area (Only visible when messages exist) */}
      {messages.length > 0 && (
        <div style={{
          position: 'absolute', bottom: '80px', left: '20px', right: '20px', zIndex: 15
        }}>
          <div className="glass-card" style={{
            display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '12px',
            borderRadius: '24px', backgroundColor: 'rgba(39, 42, 44, 0.8)', border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Paperclip size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
            <input
              type="text"
              placeholder={t('askNexus')}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1, background: 'transparent', border: 'none', color: '#fff',
                fontSize: '16px', outline: 'none', padding: '8px 0',
                fontFamily: 'Inter'
              }}
            />
            <Mic size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
            <button
              onClick={handleSend}
              style={{
                background: 'linear-gradient(135deg, var(--electric-blue), var(--violet))',
                border: 'none', borderRadius: '12px', width: '40px', height: '40px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                cursor: 'pointer', marginLeft: '4px'
              }}
            >
              <Send size={18} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Chat;
