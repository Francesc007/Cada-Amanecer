import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import BiblePage from './pages/BiblePage';
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
const HomeScreen = ({ isPremium, setIsPremium }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [streak, setStreak] = useState(0); 
  const [userName, setUserName] = useState('Francisco');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [tareasCompletadas, setTareasCompletadas] = useState({
    cita: false,
    lectura: false,
    reflexion: false
  });
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [bgImage, setBgImage] = useState('');

  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const currentDayIndex = new Date().getDay();

  useEffect(() => {
    const fetchAndSyncStreak = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const today = '2026-01-09';
        
        if (user) {
          // Cargar perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, is_premium, streak_count, last_login')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserName(profile.name || 'Francisco');
            setIsPremium(profile.is_premium || false);
            setStreak(profile.streak_count || 0);
          }

          // Cargar progreso del día
          const { data: progress } = await supabase
            .from('daily_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('fecha', today)
            .single();

          if (progress) {
            setTareasCompletadas({
              cita: progress.quote_completed,
              lectura: progress.reading_completed,
              reflexion: progress.reflection_completed
            });
          }
        } else {
          // Cargar progreso del día para INVITADOS desde LocalStorage
          const guestProgress = JSON.parse(localStorage.getItem('guest_daily_progress') || 'null');
          if (guestProgress && guestProgress.fecha === today) {
            setTareasCompletadas({
              cita: guestProgress.quote_completed,
              lectura: guestProgress.reading_completed,
              reflexion: guestProgress.reflection_completed
            });
          }
          
          // Cargar racha de invitados
          const guestStreak = parseInt(localStorage.getItem('guest_streak_count') || '0');
          setStreak(guestStreak);
        }

        // 1. Cargar Contenido Diario (Salmo y Reflexión)
        const { data: contentData, error: contentError } = await supabase
          .from('daily_content')
          .select('id, versiculo, cita, reflexion, audio_url')
          .eq('fecha', today)
          .maybeSingle();

        console.log("Datos de Supabase (daily_content):", contentData);
        if (contentError) console.error("Error Supabase (daily_content):", contentError);

        if (contentData) {
          setContent(contentData);
          
          // Verificar si es favorito en LocalStorage
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
        const { data: quotesData, error: quotesError } = await supabase
          .from('daily_quotes')
          .select('phrase, author');

        console.log("Filas de daily_quotes:", quotesData);
        if (quotesError) console.error("Error cargando daily_quotes:", quotesError);

        if (quotesData && quotesData.length > 0) {
          // Usar la fecha REAL de hoy para elegir un índice estable durante las 24h
          const realToday = new Date().toISOString().split('T')[0];
          const dateSeed = new Date(realToday).getTime();
          const index = Math.floor((dateSeed / (1000 * 60 * 60 * 24)) % quotesData.length);
          setQuoteData(quotesData[index]);
        } else {
          setQuoteData({ phrase: "No se encontraron citas en la base de datos.", author: "Sistema" });
        }
      } catch (e) {
        console.error("Error en fetchAndSyncStreak:", e);
      }
    };
    fetchAndSyncStreak();
  }, [setIsPremium]);

  const saveNote = async () => {
    if (!noteContent.trim()) return;
    setSavingNote(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const today = '2026-01-09';

      if (!user) {
        // Lógica para INVITADOS (LocalStorage)
        const guestNotes = JSON.parse(localStorage.getItem('mis_reflexiones') || '[]');
        
        // Opcional: Limitar a 1 por día también para invitados si quieres consistencia
        const alreadyHasNoteToday = guestNotes.some(n => n.fecha === today);
        if (!isPremium && alreadyHasNoteToday) {
          alert('Como invitado solo puedes guardar 1 reflexión al día. ¡Inicia sesión para guardar ilimitadas!');
          return;
        }

        const newNote = {
          id: Date.now(),
          content: noteContent.trim(),
          fecha: today,
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('mis_reflexiones', JSON.stringify([...guestNotes, newNote]));
        alert('Reflexión guardada en tu dispositivo');
      } else {
        // Lógica para USUARIOS REGISTRADOS (Supabase)
        if (!isPremium) {
          const { count } = await supabase
            .from('user_notes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', today)
            .lt('created_at', '2026-01-10');

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
      }

      setNoteContent('');
      setShowNoteModal(false);
      setTareasCompletadas(prev => ({ ...prev, reflexion: true }));
    } catch (e) {
      alert('Error al guardar: ' + e.message);
    } finally {
      setSavingNote(false);
    }
  };

  const allTasksCompleted = tareasCompletadas.cita && tareasCompletadas.lectura;

  const renderStreakIcon = () => {
    const color = allTasksCompleted ? "#D4AF37" : "#666666";
    return <TrendingUp size={20} color={color} />;
  };

  const handlePlayClick = () => {
    if (!isPremium) setShowPaywall(true);
    else setIsPlaying(!isPlaying);
  };

  const updateProgress = async (task) => {
    try {
      const today = '2026-01-09';
      
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Persistencia para INVITADOS en LocalStorage
        const guestProgress = {
          fecha: today,
          quote_completed: newTareas.cita,
          reading_completed: newTareas.lectura,
          reflection_completed: newTareas.reflexion
        };
        localStorage.setItem('guest_daily_progress', JSON.stringify(guestProgress));

        // Lógica de racha para invitados
        if (newTareas.cita && newTareas.lectura) {
          const lastStreakUpdate = localStorage.getItem('guest_last_streak_update');
          if (lastStreakUpdate !== today) {
            const currentStreak = parseInt(localStorage.getItem('guest_streak_count') || '0');
            const newStreak = currentStreak + 1;
            localStorage.setItem('guest_streak_count', newStreak.toString());
            localStorage.setItem('guest_last_streak_update', today);
            setStreak(newStreak);
            console.log("DEBUG: Racha de invitado actualizada a:", newStreak);
          }
        }
        return;
      }

      // Persistencia para USUARIOS en Supabase
      const { data: existingProgress } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('fecha', today)
        .single();

      const updateData = {
        quote_completed: newTareas.cita,
        reading_completed: newTareas.lectura,
        reflection_completed: newTareas.reflexion,
      };

      if (existingProgress) {
        await supabase
          .from('daily_progress')
          .update(updateData)
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('daily_progress')
          .insert([{ ...updateData, user_id: user.id, fecha: today }]);
      }

      // Lógica de racha (streak) solo para usuarios registrados
      if (newTareas.cita && newTareas.lectura) {
        console.log("DEBUG: Verificando racha para usuario logueado...");
        const { data: profile } = await supabase
          .from('profiles')
          .select('streak_count, last_streak_update')
          .eq('id', user.id)
          .single();

        if (profile) {
          console.log("DEBUG: Perfil encontrado. Última racha:", profile.last_streak_update);
          if (profile.last_streak_update !== today) {
            const newStreak = (profile.streak_count || 0) + 1;
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                streak_count: newStreak, 
                last_streak_update: today 
              })
              .eq('id', user.id);
            
            if (!updateError) {
              setStreak(newStreak);
              console.log("DEBUG: Racha de usuario actualizada a:", newStreak);
            } else {
              console.error("DEBUG: Error al actualizar racha:", updateError);
            }
          } else {
            console.log("DEBUG: La racha ya fue actualizada hoy.");
          }
        }
      }
    } catch (e) {
      console.error('Error en syncProgressWithDatabase:', e);
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

  const scrollToSalmo = () => {
    // Esta función ya no hace scroll, ahora abre el modal
    openReadingModal();
  };

  const openReflection = () => {
    setShowNoteModal(true);
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
          <div onClick={() => navigate('/profile')} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D4AF37', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }}>
            {userName[0]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="streak-badge" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: allTasksCompleted ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.05)', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              color: allTasksCompleted ? '#D4AF37' : '#666666', 
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
            const isToday = index === currentDayIndex;
            const isCompleted = isToday && allTasksCompleted;
            
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative', width: '30px' }}>
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: isToday ? 'bold' : 'normal', 
                  color: isToday ? '#D4AF37' : '#666666',
                  marginBottom: '2px'
                }}>
                  {day}
                </span>
                {isCompleted ? (
                  <Star size={12} color="#D4AF37" fill="#D4AF37" />
                ) : (
                  isToday && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
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
        <h1 style={{ marginBottom: '25px', fontWeight: 'bold', color: '#1A2B48' }}>Paz contigo, {userName}</h1>

        {/* Sección: Mi Camino de Hoy */}
        <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ textAlign: 'left', fontSize: '0.9rem', color: '#1A2B48', opacity: 0.8, marginBottom: '5px' }}>Mi Camino de Hoy</h3>
          
          {[
            { id: 'cita', label: 'Cita del Día', icon: <Feather size={20} />, action: openQuoteModal },
            { id: 'lectura', label: 'Lectura Diaria', icon: <Book size={20} />, action: scrollToSalmo },
            { id: 'reflexion', label: 'Mi Reflexión', icon: <MessageSquare size={20} />, action: openReflection },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1A2B48' }}>
                <div style={{ color: '#D4AF37' }}>{item.icon}</div>
                <span style={{ fontWeight: '600' }}>{item.label}</span>
              </div>
              {item.id !== 'reflexion' && (
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  border: `2px solid ${tareasCompletadas[item.id] ? '#4CAF50' : '#E0E0E0'}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: tareasCompletadas[item.id] ? '#4CAF50' : 'transparent'
                }}>
                  {tareasCompletadas[item.id] && <CheckCircle size={16} color="white" />}
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
                margin: '0' 
              }}
            >
              {savingNote ? 'Guardando...' : 'Guardar Reflexión'}
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
          backgroundColor: 'rgba(0,0,0,0.9)' 
        }}>
          <div style={{ 
            width: 'min(90vw, 400px)', 
            height: 'min(90vh, 711px)', // Mantiene proporción 9:16
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
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              backdropFilter: 'saturate(1.15)',
              zIndex: 1
            }} />
            
            <button 
              onClick={() => setShowQuoteModal(false)}
              style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                background: 'rgba(0,0,0,0.3)', 
                border: 'none', 
                color: 'white', 
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={24} />
            </button>

            <div style={{ zIndex: 2, maxWidth: '100%', position: 'relative' }}>
              <Feather size={40} color="#D4AF37" style={{ marginBottom: '20px' }} />
              <h2 style={{ 
                color: 'white', 
                fontSize: '1.8rem', 
                fontStyle: 'italic', 
                lineHeight: '1.4',
                marginBottom: '20px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                "{quoteData?.phrase || 'Cargando cita...'}"
              </h2>
              <p style={{ color: '#D4AF37', fontSize: '1.1rem', fontWeight: 'bold', textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>
                — {quoteData?.author || '...'}
              </p>
            </div>

            <button 
              className="primary-button" 
              onClick={handleAmen}
              style={{ 
                position: 'absolute', 
                bottom: '40px', 
                backgroundColor: 'white', 
                color: '#1A2B48',
                border: 'none',
                width: 'auto',
                padding: '12px 40px',
                zIndex: 10,
                borderRadius: '30px'
              }}
            >
              Amén
            </button>
          </div>
        </div>
      )}

      {/* Modal Lectura Diaria */}
      {showReadingModal && (
        <div className="modal-overlay" onClick={() => setShowReadingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            backgroundColor: '#FDFCF0', 
            padding: '20px', 
            borderRadius: '32px', 
            maxWidth: '95%',
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#1A2B48', fontWeight: 'bold' }}>Lectura Diaria</h2>
              <button onClick={() => setShowReadingModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A2B48' }}>
                <X size={28} />
              </button>
            </div>

            <div className="daily-card" style={{ 
              backgroundColor: 'white', 
              position: 'relative', 
              margin: '0 auto', 
              width: '88%', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
              border: '1px solid rgba(212, 175, 55, 0.15)',
              padding: '50px 15px 30px',
              borderRadius: '24px',
              textAlign: 'center',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div onClick={toggleFavorite} style={{ position: 'absolute', top: '-30px', right: '5px', cursor: 'pointer' }}>
                  <Heart size={24} color={isFavorite ? "#D4AF37" : "#1A2B48"} fill={isFavorite ? "#D4AF37" : "none"} />
                </div>
                <p style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>{content?.versiculo}</p>
                <h2 className="verse-text" style={{ color: '#1A2B48', fontSize: '1.6rem', marginBottom: '25px', fontStyle: 'italic', lineHeight: '1.4' }}>"{content?.cita}"</h2>
                <div className="card-divider" style={{ margin: '20px auto' }}></div>
                <p className="reflection-text" style={{ textAlign: 'justify', color: '#1A2B48', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>{content?.reflexion}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', width: '100%' }}>
                  <div className="waveform">
                    {[1,2,3,4].map(i => <div key={i} className="wave-bar" style={{height: `${10 + Math.random()*20}px`}}></div>)}
                  </div>
                  <button onClick={handlePlayClick} style={{ width: '65px', height: '65px', borderRadius: '50%', backgroundColor: '#1A2B48', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(26, 43, 72, 0.3)' }}>
                    <div style={{ color: '#D4AF37' }}>
                      {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: 4 }} />}
                    </div>
                  </button>
                  <div className="waveform">
                    {[1,2,3,4].map(i => <div key={i} className="wave-bar" style={{height: `${10 + Math.random()*20}px`}}></div>)}
                  </div>
                </div>
              </div>
            </div>
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
      <Navbar activeTab="home" isPremium={isPremium} />
    </div>
  );
};

// --- APP PRINCIPAL ---
function App() {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/home" element={<HomeScreen isPremium={isPremium} setIsPremium={setIsPremium} />} />
            <Route path="/bible" element={<BiblePage isPremium={isPremium} />} />
            <Route path="/explore" element={<ExplorePlaceholder isPremium={isPremium} />} />
            <Route path="/guide" element={<GuidePlaceholder isPremium={isPremium} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

const ExplorePlaceholder = ({ isPremium }) => (
  <div style={{ padding: '20px', backgroundColor: '#FDFCF0', minHeight: '100vh', position: 'relative' }}>
    <h1 style={{ color: '#1A2B48', fontWeight: 'bold' }}>Explora</h1>
    <p style={{ color: '#1A2B48', opacity: 0.6 }}>Meditaciones y planes de lectura en camino...</p>
    <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', position: 'relative', flex: 1 }}>
        <p style={{ color: '#1A2B48', fontWeight: 'bold' }}>Meditaciones</p>
        <PremiumBadge />
      </div>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', position: 'relative', flex: 1 }}>
        <p style={{ color: '#1A2B48', fontWeight: 'bold' }}>Planes</p>
        <PremiumBadge />
      </div>
    </div>
    <Navbar activeTab="explore" isPremium={isPremium} />
  </div>
);

const GuidePlaceholder = ({ isPremium }) => (
  <div style={{ padding: '20px', backgroundColor: '#FDFCF0', minHeight: '100vh' }}>
    <h1 style={{ color: '#1A2B48', fontWeight: 'bold' }}>Guía Espiritual</h1>
    <p style={{ color: '#1A2B48', opacity: 0.6 }}>Tu IA Espiritual está siendo bendecida...</p>
    <Navbar activeTab="guide" isPremium={isPremium} />
  </div>
);

export default App;
