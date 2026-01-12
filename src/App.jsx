import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import BiblePage from './pages/BiblePage';
import GuidePage from './pages/GuidePage';
import ExplorePage from './pages/ExplorePage';
import DiarioPage from './pages/DiarioPage';
import { Navbar, PremiumBadge, SubscriptionModal } from './components/Navigation';
import { X, Play, Pause, Heart, Sprout, TreeDeciduous, PenLine, Feather, Book, MessageSquare, CheckCircle, Sparkles, Star, UserPlus, Home, BookOpen, Compass, Crown, Search, ChevronRight as ChevronRightIcon, TrendingUp } from 'lucide-react';
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
        <div className="welcome-image-gradient"></div>
      </div>
      <div className="welcome-content">
        <div className="welcome-text-group">
          <h1 className="welcome-title">Bienvenido a Cada Amanecer</h1>
          <p className="welcome-subtitle">
            "Un refugio diario para fortalecer tu espíritu, encontrar paz y renovar tu esperanza en cada amanecer. Estamos aquí para acompañarte en tu caminar."
          </p>
        </div>
        
        <button className="primary-button" onClick={() => navigate('/onboarding')}>
          Comienza Ahora
        </button>
        
        <div className="footer-links">
          <span className="footer-link" onClick={() => setModalContent('privacy')}>Política de Privacidad</span>
          <span className="footer-link" onClick={() => setModalContent('terms')}>Términos de uso</span>
        </div>
      </div>

      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--background)', borderTop: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold' }}>{content[modalContent].title}</h2>
              <button onClick={() => setModalContent(null)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <p style={{ color: 'var(--primary)', lineHeight: '1.6', textAlign: 'justify' }}>{content[modalContent].text}</p>
            <button className="primary-button" style={{ marginTop: '30px' }} onClick={() => setModalContent(null)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE: ONBOARDING ---
const OnboardingScreen = ({ setUserName }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ goals: [], name: '', feeling: [] });

  const questions = [
    { id: 'goals', q: '¿Qué buscas hoy?', options: ['Paz', 'Guía', 'Fortaleza', 'Gratitud'], multi: true },
    { id: 'feeling', q: '¿Cómo te sientes estos días con tu fe?', options: ['Cerca de Dios', 'Buscando respuestas', 'Necesito consuelo', 'Lleno de dudas'], multi: true },
    { id: 'name', q: '¿Cuál es tu nombre?', type: 'input' }
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

  const next = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Guardar nombre en Supabase y estado global al finalizar
      try {
        const deviceId = localStorage.getItem('cada_amanecer_device_id');
        if (deviceId && answers.name.trim()) {
          const { error } = await supabase
            .from('profiles')
            .update({ name: answers.name.trim() })
            .eq('id', deviceId);
          
          if (error) throw error;
          setUserName(answers.name.trim());
        }
      } catch (e) {
        console.error('Error guardando nombre en onboarding:', e);
      }
      navigate('/home');
    }
  };

  const q = questions[step];

  return (
    <div className="onboarding-screen">
      <div className="progress-bar-container">
        {[0, 1, 2].map(i => <div key={i} className={`progress-step ${i <= step ? 'active' : ''}`} />)}
      </div>
      <h2 className="question-title">{q.q}</h2>
      
      <div className="options-list">
        {q.type === 'input' ? (
          <input 
            type="text"
            value={answers[q.id]}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            placeholder="Tu nombre aquí..."
            className="onboarding-input"
            autoFocus
          />
        ) : (
          q.options.map(opt => (
            <div 
              key={opt} 
              className={`option-item ${q.multi ? (answers[q.id].includes(opt) ? 'selected' : '') : (answers[q.id] === opt ? 'selected' : '')}`} 
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </div>
          ))
        )}
      </div>

      <button 
        className="primary-button" 
        style={{ marginTop: '30px' }} 
        disabled={q.type === 'input' ? !answers[q.id].trim() : (q.multi ? answers[q.id].length === 0 : !answers[q.id])} 
        onClick={next}
      >
        {step === 2 ? 'Finalizar' : 'Siguiente'}
      </button>
    </div>
  );
};

// --- COMPONENTE: HOME ---
const HomeScreen = ({ 
  isPremium, setIsPremium, 
  userName, 
  avatarUrl,
  streak, setStreak,
  completedDays, setCompletedDays,
  tareasCompletadas, setTareasCompletadas
}) => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [bgImage, setBgImage] = useState('');

  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  useEffect(() => {
    const getLocalDate = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const fetchContent = async () => {
      try {
        const today = getLocalDate();
        
        // 1. Cargar Contenido Diario
        const { data: contentData } = await supabase
          .from('daily_content')
          .select('id, versiculo, cita, reflexion, audio_url')
          .eq('fecha', today)
          .maybeSingle();

        if (contentData) {
          setContent(contentData);
          const storedFavs = JSON.parse(localStorage.getItem('mis_favoritos') || '[]');
          setIsFavorite(storedFavs.includes(contentData.id));
        } else {
          setContent({
            versiculo: 'Cargando...',
            cita: 'No se encontró el versículo para hoy.',
            reflexion: 'Asegúrate de que la fecha en Supabase sea ' + today,
            audio_url: ''
          });
        }

        // 2. Cargar Citas
        const { data: quotesData } = await supabase
          .from('daily_quotes')
          .select('phrase, author');

        if (quotesData && quotesData.length > 0) {
          const dateSeed = new Date(today).getTime();
          const index = Math.floor((dateSeed / (1000 * 60 * 60 * 24)) % quotesData.length);
          setQuoteData(quotesData[index]);
        } else {
          setQuoteData({ phrase: "No se encontraron citas.", author: "Sistema" });
        }
      } catch (e) {
        console.error("Error en fetchContent:", e);
      }
    };
    fetchContent();
  }, []);

  const saveNote = async (noteContent) => {
    if (!noteContent.trim()) return;
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      console.log('Guardando reflexión diaria...', { deviceId });
      
      // 1. Guardar en user_reflections (Nueva tabla de diario)
      const { data, error: reflectionError } = await supabase
        .from('user_reflections')
        .insert([{
          user_id: deviceId,
          content: noteContent,
          reference: 'Reflexión Diaria'
        }])
        .select();

      if (reflectionError) {
        console.error('Error al insertar reflexión diaria:', reflectionError);
        throw reflectionError;
      }

      console.log('Reflexión diaria guardada:', data);

      // 2. Marcar progreso diario
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ updated_at: new Date() })
        .eq('id', deviceId);

      if (profileError) throw profileError;
      
      updateProgress('reflexion');
    } catch (e) {
      console.error('Error detallado en saveNote:', e.message);
      alert(`No se pudo guardar la reflexión: ${e.message}`);
    }
  };

  const allTasksCompleted = tareasCompletadas.cita && tareasCompletadas.lectura;

  const renderStreakIcon = () => {
    const color = allTasksCompleted ? "var(--accent)" : "var(--text-gray)";
    return <TrendingUp size={20} color={color} />;
  };

  const handlePlayClick = () => {
    if (!isPremium) setShowPaywall(true);
    else setIsPlaying(!isPlaying);
  };

  const updateProgress = async (task) => {
    try {
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      // Usar actualización funcional para asegurar que tenemos el estado más reciente
      setTareasCompletadas(prev => {
        const newTareas = { ...prev, [task]: true };
        
        // Ejecutar lógica de racha dentro del efecto de cambio de estado o aquí mismo con los datos nuevos
        syncProgressWithDatabase(newTareas, today);
        
        return newTareas;
      });
    } catch (e) {
      console.error('Error actualizando progreso:', e);
    }
  };

  const syncProgressWithDatabase = async (newTareas, today) => {
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      if (!deviceId) return;

      console.log('Enviando progreso a Supabase...');

      // 1. Guardar Tareas (Upsert)
      const { error: upsertError } = await supabase
        .from('daily_progress')
        .upsert({
          user_id: deviceId,
          fecha: today,
          cita_completada: newTareas.cita,
          lectura_completada: newTareas.lectura,
          reflexion_completada: newTareas.reflexion
        }, { onConflict: 'user_id,fecha' });

      if (upsertError) throw upsertError;

      // 2. Lógica de Racha (Streak)
      if (newTareas.cita && newTareas.lectura) {
        setCompletedDays(prev => ({ ...prev, [today]: true }));

        const { data: profile } = await supabase
          .from('profiles')
          .select('streak_count, last_streak_update')
          .eq('id', deviceId)
          .maybeSingle();

        if (profile && profile.last_streak_update !== today) {
          console.log('Actualizando racha (+1)...');
          const newStreak = (profile.streak_count || 0) + 1;
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              streak_count: newStreak, 
              last_streak_update: today 
            })
            .eq('id', deviceId);

          if (updateError) throw updateError;
          setStreak(newStreak);
        }
      }
    } catch (e) {
      console.error('Error en sincronización:', e.message);
    }
  };

  const openQuoteModal = () => {
    const randomImgNumber = Math.floor(Math.random() * 10) + 1;
    const supabaseUrl = 'https://elhncujrcvotrjpncfdg.supabase.co';
    const bucketUrl = `${supabaseUrl}/storage/v1/object/public/backgrounds/${randomImgNumber}.jpg`;
    
    setBgImage(`${bucketUrl}?t=${Date.now()}`);
    setShowQuoteModal(true);
  };

  const handleAmen = () => {
    setShowQuoteModal(false);
    if (!tareasCompletadas.cita) {
      updateProgress('cita');
    }
  };

  const openReadingModal = () => {
    setShowReadingModal(true);
    if (!tareasCompletadas.lectura) {
      updateProgress('lectura');
    }
  };

  const handleInviteFriends = async () => {
    const shareData = {
      title: 'Cada Amanecer',
      text: 'Te invito a unirte a Cada Amanecer y comenzar tu camino espiritual diario. 🙏',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Enlace copiado al portapapeles. ¡Compártelo con tus amigos!');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  const toggleFavorite = () => {
    if (!content?.id) return;

    try {
      const storedFavs = JSON.parse(localStorage.getItem('mis_favoritos') || '[]');
      let newFavs;

      if (isFavorite) {
        // Quitar de favoritos
        newFavs = storedFavs.filter(id => id !== content.id);
        setIsFavorite(false);
      } else {
        // Agregar a favoritos
        newFavs = [...storedFavs, content.id];
        setIsFavorite(true);
      }

      localStorage.setItem('mis_favoritos', JSON.stringify(newFavs));
    } catch (e) {
      console.error("Error al gestionar favoritos en LocalStorage:", e);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div onClick={() => navigate('/profile')} style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            backgroundColor: '#D4AF37', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'white', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            fontSize: '1.4rem',
            boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
            transition: 'transform 0.2s ease',
            overflow: 'hidden' // Para que la imagen respete el círculo
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userName[0]
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="streak-badge" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: allTasksCompleted ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.05)', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              color: allTasksCompleted ? 'var(--accent)' : 'var(--text-gray)', 
              fontWeight: 'bold' 
            }}>
              {renderStreakIcon()}
              <span>{streak} días</span>
            </div>
            <button 
              onClick={handleInviteFriends}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: 'none',
                color: '#D4AF37',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Invitar amigos"
            >
              <UserPlus size={20} />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', width: '100%', marginTop: '10px' }}>
          {days.map((day, index) => {
            // Usar la fecha de hoy para comparar
            const d = new Date();
            const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            
            // Calcular la fecha para cada día de la semana actual
            const dateForDay = new Date(d);
            dateForDay.setDate(d.getDate() - d.getDay() + index);
            const dateStr = `${dateForDay.getFullYear()}-${String(dateForDay.getMonth() + 1).padStart(2, '0')}-${String(dateForDay.getDate()).padStart(2, '0')}`;
            
            const isToday = dateStr === todayStr;
            const isCompleted = completedDays[dateStr] || (isToday && tareasCompletadas.cita && tareasCompletadas.lectura);
            
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative', width: '30px' }}>
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: 'bold', 
                  color: (isToday || isCompleted) ? 'var(--accent)' : 'var(--text-gray)',
                  marginBottom: '2px'
                }}>
                  {day}
                </span>
                {isCompleted ? (
                  <Star size={16} color="var(--accent)" fill="var(--accent)" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />
                ) : (
                  isToday && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                )}
              </div>
            );
          })}
        </div>
      </header>
      
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '2px', opacity: 0.6, marginTop: '15px', textTransform: 'uppercase' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </p>
        <h1 style={{ marginBottom: '25px', fontWeight: 'bold', color: 'var(--primary)' }}>Paz contigo, {userName}</h1>

        {/* Sección: Mi Camino de Hoy */}
        <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ textAlign: 'left', fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8, marginBottom: '5px' }}>Mi Camino de Hoy</h3>
          
          {[
            { id: 'cita', label: 'Cita del Día', icon: <Feather size={20} />, action: openQuoteModal },
            { id: 'lectura', label: 'Lectura Diaria', icon: <Book size={20} />, action: openReadingModal },
            { id: 'reflexion', label: 'Mi Reflexión', icon: <MessageSquare size={20} />, action: () => setShowNoteModal(true) },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: 'var(--white)',
                borderRadius: '16px',
                border: '1px solid var(--divider)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
                <div style={{ color: 'var(--accent)' }}>{item.icon}</div>
                <span style={{ fontWeight: '600' }}>{item.label}</span>
              </div>
              {item.id !== 'reflexion' && (
                <div style={{ 
                  width: '18px', 
                  height: '18px', 
                  borderRadius: '50%', 
                  border: `2px solid ${tareasCompletadas[item.id] ? '#D4AF37' : '#E0E0E0'}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: tareasCompletadas[item.id] ? '#D4AF37' : 'transparent'
                }}>
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* Modal para Escribir Reflexión */}
      {showNoteModal && (
        <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            backgroundColor: 'var(--background)', 
            padding: '25px', 
            borderRadius: '24px', 
            boxSizing: 'border-box',
            border: '1px solid var(--divider)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PenLine size={24} /> Mi Reflexión
              </h2>
              <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
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
                border: '1px solid var(--accent)',
                backgroundColor: 'var(--white)', 
                color: 'var(--primary)', 
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
              onClick={() => {
                saveNote(noteContent);
                setNoteContent('');
                setShowNoteModal(false);
              }}
              disabled={!noteContent.trim()}
              style={{ 
                opacity: (!noteContent.trim()) ? 0.7 : 1,
                width: '100%',
                margin: '0' 
              }}
            >
              Guardar Reflexión
            </button>
          </div>
        </div>
      )}

      {/* Modal Cita del Día */}
      {showQuoteModal && (
        <div className="modal-overlay" style={{ 
          padding: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(0,0,0,0.95)',
          maxWidth: '430px',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 0, // Ocupa toda la pantalla, incluyendo el área del navbar
          zIndex: 3000 
        }}>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            textAlign: 'center',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
          }}>
            {/* Overlay sutil solo para legibilidad, sin degradado pesado */}
            <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.2)', // Mucho más ligero
              backdropFilter: 'contrast(1.2) saturate(1.1)', // Aumenta contraste y nitidez
              zIndex: 1
            }} />
            
            <div style={{ zIndex: 2, maxWidth: '100%', position: 'relative' }}>
              <Feather size={40} color="#D4AF37" style={{ marginBottom: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
              <h2 style={{ 
                color: 'white', 
                fontSize: '1.8rem', 
                fontStyle: 'italic', 
                lineHeight: '1.4',
                marginBottom: '0px',
                textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' // Sombra oscura para resaltar en fondos claros
              }}>
                "{quoteData?.phrase || 'Cargando cita...'}"
              </h2>
              <p style={{ 
                color: '#D4AF37', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                textShadow: '1px 1px 4px rgba(0,0,0,0.8)' 
              }}>
                — {quoteData?.author || '...'}
              </p>
            </div>

            <button 
              className="primary-button" 
              onClick={handleAmen}
              style={{ 
                position: 'absolute', 
                bottom: '80px', 
                backgroundColor: 'white', 
                color: '#1A2B48',
                border: 'none',
                width: 'auto',
                padding: '12px 25px', // Reducido el padding lateral para hacerlo más pequeño
                zIndex: 10,
                borderRadius: '12px', // Forma casi cuadrada, bordes suaves
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                fontSize: '1.1rem' // Manteniendo el tamaño del texto
              }}
            >
              Amén
            </button>
          </div>
        </div>
      )}

      {/* Modal Lectura Diaria */}
      {showReadingModal && (
        <div className="modal-overlay" style={{ 
          padding: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'var(--background)', // Fondo del mismo color que la tarjeta
          maxWidth: '430px',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 0,
          zIndex: 3000 
        }} onClick={() => setShowReadingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            backgroundColor: 'var(--background)', 
            padding: '40px 20px', 
            borderRadius: '0', 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            position: 'relative', 
            overflow: 'hidden' // Elimina el scroll
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px', // Reducido para consistencia
              width: '100%'
            }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>Lectura Diaria</h2>
              <button onClick={() => setShowReadingModal(false)} style={{ 
                background: 'rgba(26, 43, 72, 0.05)', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--primary)',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <X size={24} />
              </button>
            </div>

            <div className="daily-card" style={{ 
              backgroundColor: 'var(--white)', 
              position: 'relative', 
              width: '100%', 
              boxShadow: 'var(--shadow)', 
              border: '1px solid var(--divider)',
              padding: '45px 20px 25px', // Aumentado padding superior de 20px a 45px
              borderRadius: '24px',
              textAlign: 'center',
              flex: 1, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div onClick={toggleFavorite} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', zIndex: 10 }}>
                <Heart size={24} color={isFavorite ? "var(--accent)" : "var(--primary)"} fill={isFavorite ? "var(--accent)" : "none"} />
              </div>
              
              <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1px' }}>
                {content?.versiculo}
              </p>
              
              <h2 className="verse-text" style={{ 
                color: 'var(--primary)', 
                fontSize: '1.5rem', 
                marginBottom: '1px', 
                fontStyle: 'italic', 
                lineHeight: '1.4',
                padding: '0 10px'
              }}>
                "{content?.cita}"
              </h2>
              
              {/* Un solo espacio mínimo entre cita y reflexión */}
              <div style={{ height: '5px' }} />
              
              <p className="reflection-text" style={{ 
                textAlign: 'justify', 
                color: 'var(--primary)', 
                fontSize: '1.05rem', 
                lineHeight: '1.6', 
                marginBottom: '15px',
                whiteSpace: 'pre-wrap',
                padding: '0 5px'
              }}>
                {content?.reflexion?.replace(/\\n/g, '\n')}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', width: '100%', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ width: '3px', height: `${10 + Math.random()*20}px`, backgroundColor: '#D4AF37', borderRadius: '3px' }}></div>)}
                </div>
                <button onClick={handlePlayClick} style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  border: 'none', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 12px rgba(26, 43, 72, 0.25)' 
                }}>
                  <div style={{ color: 'var(--accent)' }}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: 3 }} />}
                  </div>
                </button>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ width: '3px', height: `${10 + Math.random()*20}px`, backgroundColor: '#D4AF37', borderRadius: '3px' }}></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaywall && (
        <div className="modal-overlay" onClick={() => setShowPaywall(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--background)', borderRadius: '30px 30px 0 0', padding: '40px 30px', textAlign: 'center', border: '1px solid var(--divider)' }}>
            <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>PREMIUM</span>
            <h2 className="modal-title" style={{ marginTop: '20px', color: 'var(--primary)', fontWeight: 'bold' }}>Escucha tu oración diaria</h2>
            <p className="modal-desc" style={{ color: 'var(--primary)', opacity: 0.8, lineHeight: '1.6' }}>Comienza tu prueba de 7 días gratis.<br/> Después solo <strong>$49 MXN/mes</strong>.</p>
            <button className="primary-button" style={{ backgroundColor: 'var(--accent)', color: 'white', marginTop: '20px', border: 'none' }} onClick={() => { setIsPremium(true); setShowPaywall(false); }}>Activar Prueba Gratuita</button>
            <p style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--primary)', opacity: 0.5 }}>Cancela en cualquier momento</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- APP PRINCIPAL ---
function App() {
  const [isPremium, setIsPremium] = useState(false);
  const [userName, setUserName] = useState('Francisco');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [streak, setStreak] = useState(0);
  const [completedDays, setCompletedDays] = useState({});
  const [tareasCompletadas, setTareasCompletadas] = useState({
    cita: false,
    lectura: false,
    reflexion: false
  });

  useEffect(() => {
    let deviceId = localStorage.getItem('cada_amanecer_device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('cada_amanecer_device_id', deviceId);
    }

    const loadAppData = async () => {
      const currentDeviceId = localStorage.getItem('cada_amanecer_device_id');
      if (!currentDeviceId) return;

      try {
        const d = new Date();
        const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfWeekStr = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;

        // 1. Cargar Perfil y Racha
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('name, avatar_url, is_premium, streak_count, premium_until')
          .eq('id', currentDeviceId)
          .maybeSingle();
        
        if (profileError) {
          console.warn('Error al cargar perfil completo, intentando versión básica:', profileError.message);
          // Si falla por columnas nuevas, intentar solo las básicas
          const { data: basicProfile } = await supabase
            .from('profiles')
            .select('name, avatar_url, is_premium, streak_count')
            .eq('id', currentDeviceId)
            .maybeSingle();
          
          if (basicProfile) {
            setUserName(basicProfile.name || 'Francisco');
            setAvatarUrl(basicProfile.avatar_url || null);
            setIsPremium(basicProfile.is_premium || false);
            setStreak(basicProfile.streak_count || 0);
          }
        } else if (profile) {
          setUserName(profile.name || 'Francisco');
          setAvatarUrl(profile.avatar_url || null);
          setStreak(profile.streak_count || 0);

          // Verificar si el premium ha expirado
          let premiumActive = profile.is_premium || false;
          if (premiumActive && profile.premium_until) {
            const now = new Date();
            const expiration = new Date(profile.premium_until);
            if (now > expiration) {
              console.log('Premium expirado. Bloqueando funciones.');
              premiumActive = false;
              // Actualizar en la base de datos para persistir el bloqueo
              await supabase.from('profiles').update({ is_premium: false }).eq('id', currentDeviceId);
            }
          }
          setIsPremium(premiumActive);
        } else {
          // Crear perfil inicial si no existe
          await supabase.from('profiles').upsert([{ id: currentDeviceId, name: 'Francisco' }]);
        }

        // 2. Cargar Progreso Semanal
        const { data: weeklyData } = await supabase
          .from('daily_progress')
          .select('fecha, cita_completada, lectura_completada, reflexion_completada')
          .eq('user_id', currentDeviceId)
          .gte('fecha', startOfWeekStr);

        if (weeklyData) {
          const completedMap = {};
          weeklyData.forEach(d => {
            if (d.cita_completada && d.lectura_completada) {
              completedMap[d.fecha] = true;
            }
          });
          setCompletedDays(completedMap);
          
          const todayProgress = weeklyData.find(d => d.fecha === today);
          if (todayProgress) {
            setTareasCompletadas({
              cita: todayProgress.cita_completada,
              lectura: todayProgress.lectura_completada,
              reflexion: todayProgress.reflexion_completada
            });
          }
        }
      } catch (err) {
        console.error('Error loading app data:', err);
      }
    };
    loadAppData();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen setUserName={setUserName} />} />
          <Route path="/home" element={<HomeScreen 
              isPremium={isPremium} 
              setIsPremium={setIsPremium} 
              userName={userName} 
              setUserName={setUserName}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              streak={streak}
              setStreak={setStreak}
              completedDays={completedDays}
              setCompletedDays={setCompletedDays}
              tareasCompletadas={tareasCompletadas}
              setTareasCompletadas={setTareasCompletadas}
            />} />
            <Route path="/bible" element={<BiblePage isPremium={isPremium} />} />
            <Route path="/explore" element={<ExplorePage isPremium={isPremium} />} />
            <Route path="/guide" element={<GuidePage isPremium={isPremium} />} />
            <Route path="/profile" element={<ProfilePage 
              isPremium={isPremium}
              setIsPremium={setIsPremium}
              userName={userName} 
              setUserName={setUserName}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
            />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/diario" element={<DiarioPage />} />
          </Routes>
          <Navbar 
            isPremium={isPremium} 
            setIsPremium={setIsPremium}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
