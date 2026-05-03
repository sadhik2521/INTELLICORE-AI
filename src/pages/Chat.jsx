import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Paperclip, Send, Sparkles, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useModel } from '../context/ModelContext';
import BottomNav from '../components/BottomNav';
import AnimatedBackground from '../components/AnimatedBackground';

const Chat = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { selectedModel } = useModel();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const historyRef = useRef(null);
  const intervalRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchChats();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target) && !event.target.closest('.menu-trigger')) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchChats = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`${API_URL}/api/chats/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setMessages(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const userMsg = { user_id: user.id, message: input, sender: 'user', timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userMsg, model: selectedModel })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.aiResponse) {
          simulateStreaming(data.aiResponse, updatedMessages);
        } else {
          setIsTyping(false);
        }
      } else {
        setIsTyping(false);
      }
    } catch (err) {
      console.error('Send error:', err);
      setIsTyping(false);
    }
  };

  const simulateStreaming = (fullText, baseMessages) => {
    let currentText = '';
    const words = fullText.split(' ');
    let i = 0;
    
    const aiMsgId = Date.now();
    setMessages([...baseMessages, { id: aiMsgId, message: '', sender: 'ai' }]);
    setIsTyping(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, message: currentText } : m));
        i++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 30);
  };

  const handleClearHistory = async () => {
    if (!user || !window.confirm('Clear all chat history?')) return;
    try {
      const response = await fetch(`${API_URL}/api/chats/${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setMessages([]);
        setShowHistory(false);
      }
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const historyQueries = Array.isArray(messages) 
    ? Array.from(new Set(messages.filter(m => m.sender === 'user').map(m => m.message))).reverse() 
    : [];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative',
      overflow: 'hidden', backgroundColor: 'var(--background)'
    }}>
      <AnimatedBackground />
      
      {/* Sidebar History Overlay */}
      {showHistory && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, backdropFilter: 'blur(4px)'
        }}>
          <div ref={historyRef} style={{
            width: '280px', height: '100%', backgroundColor: 'var(--surface-container-low)',
            padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px',
            boxShadow: '4px 0 20px rgba(0,0,0,0.3)', animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--primary)' }}>{t('history')}</h3>
              <X size={20} onClick={() => setShowHistory(false)} style={{ cursor: 'pointer', color: 'var(--outline)' }} />
            </div>

            <div 
              onClick={handleClearHistory}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', 
                borderRadius: '12px', border: '1px solid #ff6b6b33', color: '#ff6b6b',
                cursor: 'pointer', fontSize: '14px', backgroundColor: '#ff6b6b0a'
              }}
            >
              <Trash2 size={16} /> {t('clearHistory')}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {historyQueries.length > 0 ? historyQueries.map((query, idx) => (
                <div 
                  key={idx}
                  onClick={() => { setInput(query); setShowHistory(false); }}
                  style={{ 
                    padding: '12px', borderRadius: '12px', backgroundColor: 'var(--surface-container-high)',
                    fontSize: '14px', cursor: 'pointer', border: '1px solid var(--outline-variant)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--on-surface)'
                  }}
                >
                  {query}
                </div>
              )) : <div style={{ textAlign: 'center', color: 'var(--outline)', marginTop: '40px' }}>No history yet</div>}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', borderBottom: '1px solid var(--surface-variant)',
        backgroundColor: 'var(--surface-container-lowest)', zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <div className="menu-trigger" onClick={() => setShowHistory(!showHistory)} style={{ cursor: 'pointer' }}>
          <Menu size={24} color="var(--outline)" />
        </div>
        <h2 style={{ 
          background: 'linear-gradient(135deg, var(--on-surface) 30%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0, fontSize: '18px', fontWeight: 700 
        }}>INTELLICORE AI</h2>
        <div 
          onClick={() => navigate('/profile')}
          style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--primary)', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {user?.avatar ? <img src={user.avatar} style={{width:'100%', height:'100%'}} /> : <User size={20} style={{color:'var(--outline)'}} />}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div key={index} style={{ 
            display: 'flex', gap: '12px', 
            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', 
              backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {msg.sender === 'user' ? <User size={18} color="#fff" /> : <Sparkles size={18} color="#fff" />}
            </div>
            <div style={{
              maxWidth: '80%', padding: '12px 16px', borderRadius: '16px',
              backgroundColor: msg.sender === 'user' ? 'var(--primary-container)' : 'var(--surface-container-high)',
              color: 'var(--on-surface)',
              borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.sender === 'user' ? '16px' : '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.message}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px', backgroundColor: 'var(--background)', zIndex: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '24px', 
          backgroundColor: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)'
        }}>
          <Paperclip size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askAnything')}
            style={{ 
              flex: 1, background: 'none', border: 'none', color: 'var(--on-surface)', 
              padding: '8px', fontSize: '15px', outline: 'none' 
            }}
          />
          <div onClick={handleSend} style={{ 
            width: '36px', height: '36px', borderRadius: '50%', 
            backgroundColor: input.trim() ? 'var(--primary)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            <Send size={18} color={input.trim() ? '#fff' : 'var(--outline)'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
