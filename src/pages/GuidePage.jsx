import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Sparkles, Loader2, MessageSquare, Heart, BookOpen, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SYSTEM_PROMPT = `
Eres la Guía de la aplicación "Cada Amanecer", un acompañante espiritual escrito.
Tu objetivo es crear una experiencia de conversación tranquila, respetuosa y no intrusiva.
El usuario busca expresarse libremente y recibir acompañamiento.

COMPORTAMIENTO:
- Eres un acompañante espiritual, NO un predicador.
- NO des consejos médicos, psicológicos ni terapéuticos.
- NO diagnostiques ni juzgues.
- NO seas intrusivo ni insistente.
- Responde ÚNICAMENTE a lo que el usuario trae.
- Mantén un tono sereno, humano, empático y BREVE.
- Evita respuestas largas o moralizantes.
- NUNCA impongas creencias.

USO DE LA BIBLIA:
- Solo cita o explica pasajes bíblicos si el usuario lo pide explícitamente o el contexto lo hace natural y respetuoso.
- Usa lenguaje claro al citar.
- Explica el sentido de forma sencilla y aplicable.
- NO corrigas ni confrontes.

ESTILO:
- Lenguaje claro, cercano y respetuoso. Frases cortas.
- Preguntas abiertas y suaves solo si es apropiado.
- Refleja sentimientos ("Parece que hoy estás cargando mucho...").
- Ofrece opciones suaves ("Si quieres, puedo compartir una oración o una reflexión").
`;

const GuidePage = ({ isPremium }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      id: 'init', 
      type: 'bot', 
      text: 'Bienvenido. Estoy aquí para acompañarte.\n\nPuedes escribir lo que hoy tengas en el corazón, pedir una reflexión, una oración, o hablar sobre algún pasaje bíblico.' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll al final
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const userMessage = { id: Date.now(), type: 'user', text: userText };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Preparamos el contexto para la IA (System + Historial + Nuevo mensaje)
      const chatHistory = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ 
          role: m.type === 'user' ? 'user' : 'assistant', 
          content: m.text 
        })),
        { role: 'user', content: userText }
      ];

      // SIMULACIÓN DE IA (Reemplazar por fetch real cuando el backend esté listo)
      // Ejemplo de fetch real:
      /*
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': \`Bearer ${process.env.OPENAI_API_KEY}\`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: chatHistory
        })
      });
      const data = await response.json();
      const botText = data.choices[0].message.content;
      */

      setTimeout(() => {
        let botText = "";
        const lowerText = userText.toLowerCase();

        // Respuestas simuladas basadas en los casos de prueba del usuario
        if (lowerText.includes('mal') || lowerText.includes('triste')) {
          botText = "Siento que hoy el día se sienta así de gris para ti. A veces, simplemente permitirnos estar mal es el primer paso para sanar. ¿Hay algo en particular que te esté pesando más?";
        } else if (lowerText.includes('oración') || lowerText.includes('oracion')) {
          botText = "Claro. 'Padre, te pedimos que en este momento tu paz descienda sobre este corazón. Que sienta tu compañía y que su carga se haga más ligera. Amén'. ¿Te gustaría que busquemos una reflexión sobre esto?";
        } else if (lowerText.includes('pasaje') || lowerText.includes('explícame') || lowerText.includes('explicame')) {
          botText = "Es un pasaje que nos habla de la fidelidad. En palabras sencillas, nos dice que aunque no veamos el camino completo, cada paso que damos con fe tiene un propósito. ¿Te gustaría que profundicemos en algún verso?";
        } else if (lowerText.includes('no sé') || lowerText.includes('no se qué') || lowerText.includes('necesito')) {
          botText = "Está bien no saber. A veces el corazón solo necesita un espacio de silencio y compañía. Aquí estoy para lo que surja, sin prisas.";
        } else if (lowerText.includes('solo quería escribir') || lowerText.includes('escribir')) {
          botText = "Este es tu espacio. Escribir es una forma hermosa de soltar lo que llevamos dentro. Te leo con mucho respeto.";
        } else {
          botText = "Te escucho. Parece que esto es algo importante para ti hoy. Cuéntame lo que necesites compartir.";
        }

        const botResponse = { id: Date.now() + 1, type: 'bot', text: botText };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error('Error en la Guía:', error);
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container" style={{ 
      backgroundColor: 'var(--background)', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '430px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Header Fijo */}
      <header style={{ 
        padding: '15px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        zIndex: 10
      }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            backgroundColor: 'var(--accent)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'white',
            boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)', margin: 0, letterSpacing: '-0.5px' }}>Guía Espiritual</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4CAF50' }}></div>
              <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Acompañamiento Activo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Área de Chat */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '20px 15px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          paddingBottom: '100px'
        }}
        className="custom-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              width: '100%',
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <div style={{ 
              maxWidth: '85%', 
              padding: '12px 16px', 
              borderRadius: msg.type === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
              backgroundColor: msg.type === 'user' ? 'var(--primary)' : 'white',
              color: msg.type === 'user' ? 'white' : 'var(--primary)',
              boxShadow: msg.type === 'user' ? '0 4px 12px rgba(26, 43, 72, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
              fontSize: '0.95rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              border: msg.type === 'bot' ? '1px solid rgba(0,0,0,0.03)' : 'none'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '8px', 
            padding: '10px 15px', 
            backgroundColor: 'white', 
            borderRadius: '15px', 
            width: 'fit-content',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.03)'
          }}>
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: '500' }}>El Guía está reflexionando...</span>
          </div>
        )}
      </div>

      {/* Input de Chat Fijo al final */}
      <div style={{ 
        padding: '15px',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: '80px', // Espacio para el navbar
        left: 0,
        right: 0,
        zIndex: 20
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          backgroundColor: 'white',
          padding: '8px 8px 8px 15px',
          borderRadius: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe con confianza..."
            disabled={isTyping}
            style={{ 
              flex: 1, 
              border: 'none', 
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              fontSize: '0.95rem',
              outline: 'none',
              padding: '8px 0'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: inputValue.trim() ? 'var(--accent)' : '#EEE', 
              border: 'none', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flexShrink: 0,
              boxShadow: inputValue.trim() ? '0 4px 10px rgba(212, 175, 55, 0.3)' : 'none'
            }}
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
