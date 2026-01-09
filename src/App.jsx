import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { X, Play, Pause, Heart, Sprout, TreeDeciduous, Leaf, PenLine } from 'lucide-react';
import './App.css';

// --- COMPONENTE: PANTALLA DE BIENVENIDA ---
const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);

  const content = {
    terms: {
      title: 'Términos y Condiciones',
      text: 'Al usar Cada Amanecer, te comprometes a hacer un uso personal y respetuoso de los contenidos. Queda prohibida la reproducción comercial o redistribución de las reflexiones sin consentimiento expreso. Nos reservamos el derecho de actualizar estos términos para mejorar tu experiencia.'
    },
    privacy: {
      title: 'Política de Privacidad',
      text: 'Tus datos son sagrados para nosotros. Solo almacenamos la información necesaria (como tu nombre y preferencias) para ofrecerte una experiencia personalizada. Nunca compartiremos tus datos con terceros sin tu permiso explícito.'
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-image-container">
        <img src="/biblia.jpg" alt="Biblia" className="welcome-image" />
      </div>
      <div className="welcome-content">
        <div className="welcome-text-group">
          <h1 className="welcome-title">Bienvenido a Cada Amanecer</h1>
          <p className="welcome-subtitle">
            "Sin importar en qué punto de tu fe te encuentres, aquí encontrarás un hogar, apoyo y esperanza renovada para tu camino."
          </p>
        </div>
        
        <div className="welcome-action-area">
          <button className="primary-button" onClick={() => navigate('/onboarding')}>
            Comienza Ahora
          </button>
          
          <div className="footer-links">
            <span className="footer-link" onClick={() => setModalContent('privacy')}>Política de Privacidad</span>
            <span className="footer-link" onClick={() => setModalContent('terms')}>Términos de uso</span>
          </div>
        </div>
      </div>

      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#FDFCF0', borderTop: '4px solid #D4AF37' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1A2B48', fontWeight: 'bold' }}>{content[modalContent].title}</h2>
              <button onClick={() => setModalContent(null)} style={{ background: 'none', border: 'none', color: '#1A2B48', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <p style={{ color: '#1A2B48', lineHeight: '1.6', textAlign: 'justify' }}>{content[modalContent].text}</p>
            <button className="primary-button" style={{ marginTop: '30px' }} onClick={() => setModalContent(null)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE: ONBOARDING ---
const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ goals: [], time: '', feeling: [] });

  const questions = [
    { id: 'goals', q: '¿Qué buscas hoy?', options: ['Paz', 'Guía', 'Fortaleza', 'Gratitud'], multi: true },
    { id: 'time', q: '¿En qué momento prefieres tu oración?', options: ['Mañana', 'Tarde', 'Noche'], multi: false },
    { id: 'feeling', q: '¿Cómo te sientes estos días con tu fe?', options: ['Cerca de Dios', 'Buscando respuestas', 'Necesito consuelo', 'Lleno de dudas'], multi: true }
  ];

  const handleSelect = (opt) => {
    const q = questions[step];
    if (q.multi) {
      const current = answers[q.id];
      setAnswers({ ...answers, [q.id]: current.includes(opt) ? current.filter(i => i !== opt) : [...current, opt] });
    } else {
      setAnswers({ ...answers, [q.id]: opt });
    }
  };

  const next = () => {
    if (step < 2) setStep(step + 1);
    else navigate('/home');
  };

  const q = questions[step];

  return (
    <div className="onboarding-screen">
      <div className="progress-bar-container">
        {[0, 1, 2].map(i => <div key={i} className={`progress-step ${i <= step ? 'active' : ''}`} />)}
      </div>
      <h2 className="question-title">{q.q}</h2>
      <div className="options-list">
        {q.options.map(opt => (
          <div key={opt} className={`option-item ${q.multi ? (answers[q.id].includes(opt) ? 'selected' : '') : (answers[q.id] === opt ? 'selected' : '')}`} onClick={() => handleSelect(opt)}>
            {opt}
          </div>
        ))}
      </div>
      <button className="primary-button" style={{ marginTop: '30px' }} disabled={q.multi ? answers[q.id].length === 0 : !answers[q.id]} onClick={next}>
        {step === 2 ? 'Finalizar' : 'Siguiente'}
      </button>
    </div>
  );
};

// --- COMPONENTE: HOME ---
const HomeScreen = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [streak, setStreak] = useState(0); 
  const [userName, setUserName] = useState('Francisco');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const currentDayIndex = new Date().getDay();

  useEffect(() => {
    const fetchAndSyncStreak = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, is_premium, streak_count, last_login')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserName(profile.name || 'Francisco');
            setIsPremium(profile.is_premium || false);
            
            const today = new Date().toISOString().split('T')[0];
            let currentStreak = profile.streak_count || 0;

            if (profile.last_login !== today) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yesterdayStr = yesterday.toISOString().split('T')[0];

              if (profile.last_login === yesterdayStr) {
                currentStreak += 1;
              } else if (profile.last_login) {
                currentStreak = 1;
              } else {
                currentStreak = 1;
              }

              await supabase
                .from('profiles')
                .update({ 
                  streak_count: currentStreak, 
                  last_login: today 
                })
                .eq('id', user.id);
            }
            setStreak(currentStreak);
          }
        }

        const today = new Date().toISOString().split('T')[0];
        const { data: contentData } = await supabase.from('daily_content').select('*').eq('date', today).single();
        if (contentData) setContent(contentData);
        else setContent({
          verse_title: 'Salmo 23:1',
          verse_text: 'El Señor es mi pastor; nada me faltará.',
          reflection: 'En medio de las tormentas de la vida, recordamos que no caminamos solos. Dios cuida de cada detalle de tu existencia.',
          audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        });
      } catch (e) { console.error(e); }
    };
    fetchAndSyncStreak();
  }, []);

  const saveNote = async () => {
    if (!noteContent.trim()) return;
    setSavingNote(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no identificado');

      if (!isPremium) {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const { count } = await supabase
          .from('user_notes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', today)
          .lt('created_at', tomorrowStr);

        if (count && count >= 1) {
          alert('Los usuarios gratis solo pueden guardar 1 reflexión al día. ¡Hazte Premium para reflexiones ilimitadas!');
          setShowPaywall(true);
          return;
        }
      }

      const { error } = await supabase
        .from('user_notes')
        .insert([{ 
          user_id: user.id, 
          content: noteContent.trim() 
        }]);

      if (error) throw error;

      alert('Reflexión guardada correctamente');
      setNoteContent('');
      setShowNoteModal(false);
    } catch (e) {
      alert('Error al guardar: ' + e.message);
    } finally {
      setSavingNote(false);
    }
  };

  const renderStreakIcon = () => {
    if (streak >= 11) return <TreeDeciduous size={20} color="#D4AF37" />;
    if (streak >= 4) return <Sprout size={20} color="#D4AF37" />;
    return <Leaf size={20} color="#D4AF37" />;
  };

  const handlePlayClick = () => {
    if (!isPremium) setShowPaywall(true);
    else setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div onClick={() => navigate('/profile')} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D4AF37', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }}>
            {userName[0]}
          </div>
          <div className="streak-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '6px 12px', borderRadius: '20px', color: '#D4AF37', fontWeight: 'bold' }}>
            {renderStreakIcon()}
            <span>{streak} días</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', width: '100%', marginTop: '10px' }}>
          {days.map((day, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem', fontWeight: index === currentDayIndex ? 'bold' : 'normal', color: index === currentDayIndex ? '#D4AF37' : '#666666' }}>{day}</span>
              {index === currentDayIndex && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />}
            </div>
          ))}
        </div>
      </header>
      
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.6, marginTop: '15px', textTransform: 'uppercase' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </p>
        <h1 style={{ marginBottom: '25px', fontWeight: 'bold', color: '#1A2B48' }}>Paz contigo, {userName}</h1>

        <div className="daily-card" style={{ backgroundColor: 'white', position: 'relative' }}>
          <div onClick={() => setIsFavorite(!isFavorite)} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }}>
            <Heart size={24} color={isFavorite ? "#D4AF37" : "#1A2B48"} fill={isFavorite ? "#D4AF37" : "none"} />
          </div>
          <p style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>{content?.verse_title}</p>
          <h2 className="verse-text" style={{ color: '#1A2B48' }}>"{content?.verse_text}"</h2>
          <div className="card-divider"></div>
          <p className="reflection-text" style={{ textAlign: 'justify', color: '#1A2B48' }}>{content?.reflection}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
            <div className="waveform">
              {[1,2,3,4].map(i => <div key={i} className="wave-bar" style={{height: `${10 + Math.random()*20}px`}}></div>)}
            </div>
            <button onClick={handlePlayClick} style={{ width: '75px', height: '75px', borderRadius: '50%', backgroundColor: '#1A2B48', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(26, 43, 72, 0.3)' }}>
              <div style={{ color: '#D4AF37' }}>
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: 4 }} />}
              </div>
            </button>
            <div className="waveform">
              {[1,2,3,4].map(i => <div key={i} className="wave-bar" style={{height: `${10 + Math.random()*20}px`}}></div>)}
            </div>
          </div>
        </div>

        <button className="write-button" onClick={() => setShowNoteModal(true)}>Escribir mi reflexión</button>
      </main>

      {/* Modal para Escribir Reflexión */}
      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            backgroundColor: '#FDFCF0', 
            padding: '25px', 
            borderRadius: '24px', 
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1A2B48', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PenLine size={24} /> Mi Reflexión
              </h2>
              <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A2B48' }}>
                <X size={24} />
              </button>
            </div>
            
            <textarea 
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="¿Qué te dice Dios hoy a través de esta palabra?..."
              style={{ 
                width: '100%', 
                height: '180px', 
                padding: '20px', 
                borderRadius: '16px',
                border: '1px solid #D4AF37',
                backgroundColor: 'white', 
                color: '#1A2B48', 
                fontFamily: 'inherit',
                fontSize: '1.1rem',
                resize: 'none',
                lineHeight: '1.6',
                boxSizing: 'border-box',
                display: 'block',
                marginBottom: '20px'
              }}
            />

            <button 
              className="primary-button" 
              onClick={saveNote}
              disabled={savingNote || !noteContent.trim()}
              style={{ 
                opacity: (savingNote || !noteContent.trim()) ? 0.7 : 1,
                width: '100%',
                margin: '0' // Quitar márgenes externos para que use el padding del modal
              }}
            >
              {savingNote ? 'Guardando...' : 'Guardar Reflexión'}
            </button>
          </div>
        </div>
      )}

      {showPaywall && (
        <div className="modal-overlay" onClick={() => setShowPaywall(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#FDFCF0', borderRadius: '30px 30px 0 0', padding: '40px 30px', textAlign: 'center' }}>
            <span style={{ backgroundColor: '#D4AF37', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>PREMIUM</span>
            <h2 className="modal-title" style={{ marginTop: '20px', color: '#1A2B48', fontWeight: 'bold' }}>Escucha tu oración diaria</h2>
            <p className="modal-desc" style={{ color: '#1A2B48', opacity: 0.8, lineHeight: '1.6' }}>Comienza tu prueba de 7 días gratis.<br/> Después solo <strong>$49 MXN/mes</strong>.</p>
            <button className="primary-button" style={{ backgroundColor: '#D4AF37', color: 'white', marginTop: '20px', border: 'none' }} onClick={() => { setIsPremium(true); setShowPaywall(false); }}>Activar Prueba Gratuita</button>
            <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#1A2B48', opacity: 0.5 }}>Cancela en cualquier momento</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP PRINCIPAL ---
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
