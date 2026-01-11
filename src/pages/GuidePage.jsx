import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Navbar } from '../components/Navigation';

const GuidePage = ({ isPremium }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Paz contigo. Soy tu Guía Espiritual. ¿En qué puedo acompañarte hoy? Puedes pedirme una reflexión, una oración o ayuda para entender un pasaje bíblico.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulación de respuesta de la IA
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: 'Esa es una reflexión profunda. Recuerda lo que dice la Escritura: "Tu palabra es una lámpara a mis pies y una luz en mi camino" (Salmo 119:105). Confía en que cada paso que das con fe está siendo guiado.' 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--background)', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        borderBottom: '1px solid var(--divider)',
        backgroundColor: 'var(--background)',
        zIndex: 10
      }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
          <ChevronLeft size={28} />
        </button>
        <div style={{ marginLeft: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Guía Espiritual</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold' }}>IA ACTIVA</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          paddingBottom: '150px'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="animate-fade-in"
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            <div style={{ 
              maxWidth: '85%', 
              padding: '15px 18px', 
              borderRadius: msg.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              backgroundColor: msg.type === 'user' ? 'var(--primary)' : 'var(--white)',
              color: msg.type === 'user' ? 'var(--background)' : 'var(--primary)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              border: msg.type === 'bot' ? '1px solid var(--divider)' : 'none',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: '8px', padding: '10px 15px', backgroundColor: 'var(--white)', borderRadius: '15px', width: 'fit-content', border: '1px solid var(--divider)' }}>
            <Loader2 size={18} className="animate-spin" style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>El Guía está escribiendo...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        position: 'fixed', 
        bottom: '85px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: '24%',
        maxWidth: '390px',
        padding: '6px 12px',
        backgroundColor: 'var(--white)',
        borderRadius: '20px',
        border: '1px solid var(--divider)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 100
      }}>
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu mensaje..."
          style={{ 
            flex: 1, 
            padding: '10px 5px', 
            borderRadius: '20px', 
            border: 'none', 
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <button 
          onClick={handleSend}
          disabled={!inputValue.trim()}
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: inputValue.trim() ? 'var(--accent)' : 'var(--divider)', 
            border: 'none', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'white',
            cursor: 'pointer',
            transition: '0.2s',
            flexShrink: 0
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default GuidePage;
