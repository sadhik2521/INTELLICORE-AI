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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchChats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/chats/${user.id}`);
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const newMessage = { user_id: user.id, message: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    try {
      await fetch('http://localhost:3001/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });
      // Poll for AI response or just wait a bit and fetch
      setTimeout(() => {
        fetchChats();
        setIsTyping(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
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
        <h2 className="headline-lg" onClick={() => window.location.reload()} style={{ 
          background: 'linear-gradient(135deg, #fff 30%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0, fontSize: '20px', cursor: 'pointer', fontWeight: 700 
        }}>INTELLICORE AI</h2>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          overflow: 'hidden', border: '1px solid var(--electric-blue)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)'
        }}>
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
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '140px',
        display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', opacity: 0.8, textAlign: 'center', padding: '0 40px'
          }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, rgba(46,91,255,0.15), rgba(87,27,193,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '24px', position: 'relative',
              boxShadow: '0 0 40px rgba(46,91,255,0.1)'
            }} className="pulsing-aura">
              <Sparkles size={60} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 15px var(--primary))' }} />
            </div>
            <h1 className="headline-lg" style={{ 
              color: '#fff', marginBottom: '12px', fontSize: '28px', fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>{t('howCanIHelp')}</h1>
            <p className="body-md" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px', lineHeight: '1.6' }}>
              I'm INTELLICORE, your advanced neural assistant. Ask me anything to get started.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '32px' }}>
              {['Write code', 'Explain AI', 'Brainstorm ideas'].map((item) => (
                <div key={item} onClick={() => setInput(item)} style={{
                  padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--outline-variant)',
                  fontSize: '13px', color: 'var(--on-surface-variant)', cursor: 'pointer',
                  backgroundColor: 'rgba(255,255,255,0.02)', transition: 'all 0.2s'
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
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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

      {/* Input Area */}
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

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Chat;
