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
import { speakText } from './utils/tts';
import './App.css';

// --- COMPONENTE: PANTALLA DE BIENVENIDA ---
const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);

  const content = {
    terms: {
      title: 'Términos y Condiciones',
      text: (
        <div className="custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          <p><strong>Última actualización: 13 de enero de 2026</strong></p>
          <p><strong>1. Aceptación de los términos</strong><br/>Al usar <strong>Cada Amanecer</strong>, aceptas estos Términos y Condiciones. Si no estás de acuerdo, por favor no utilices la App.</p>
          <p><strong>2. Uso de la App</strong><br/>La App ofrece contenido espiritual, reflexiones y una guía interactiva con fines de acompañamiento personal. El usuario se compromete a:
            <ul style={{ paddingLeft: '20px' }}>
              <li>Usar la App de manera respetuosa.</li>
              <li>No utilizarla con fines ilegales o abusivos.</li>
            </ul>
          </p>
          <p><strong>3. Naturaleza del contenido</strong><br/>El contenido no sustituye asesoramiento profesional, médico, psicológico o pastoral. La Guía Espiritual no realiza diagnósticos ni emite juicios.</p>
          <p><strong>4. Inteligencia Artificial</strong><br/>Las respuestas son generadas mediante inteligencia artificial:
            <ul style={{ paddingLeft: '20px' }}>
              <li>Pueden no ser siempre precisas.</li>
              <li>No representan opiniones humanas ni consejo profesional.</li>
            </ul>
          </p>
          <p><strong>5. Suscripciones y pagos</strong><br/>La App puede ofrecer contenido gratuito y funciones premium mediante suscripción o pagos únicos. Las condiciones específicas se mostrarán claramente antes de realizar cualquier pago. Las suscripciones pueden cancelarse desde la plataforma correspondiente (App Store / Google Play).</p>
          <p><strong>6. Propiedad intelectual</strong><br/>Todo el contenido de la App, incluyendo textos, diseño y estructura, es propiedad de <strong>Cada Amanecer</strong>, salvo que se indique lo contrario.</p>
          <p><strong>7. Limitación de responsabilidad</strong><br/>No nos hacemos responsables por decisiones tomadas por el usuario basadas en el contenido de la App o interrupciones técnicas.</p>
          <p><strong>8. Terminación</strong><br/>Nos reservamos el derecho de suspender el acceso si se incumplen estos términos.</p>
          <p><strong>9. Legislación aplicable</strong><br/>Estos términos se rigen por las leyes de México.</p>
          <p><strong>10. Contacto</strong><br/>Correo: </p>
        </div>
      )
    },
    privacy: {
      title: 'Política de Privacidad',
      text: (
        <div className="custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          <p><strong>Última actualización: 13 de enero de 2026</strong></p>
          <p><strong>1. Introducción</strong><br/>Esta Política de Privacidad describe cómo <strong>Cada Amanecer</strong> (“la App”) recopila, utiliza y protege la información de los usuarios. Al utilizar la App, aceptas las prácticas descritas en este documento.</p>
          <p><strong>2. Información que recopilamos</strong><br/>
            <strong>2.1 Información proporcionada por el usuario</strong><br/>Nombre: utilizado únicamente para personalizar la experiencia dentro de la App. Este dato se almacena localmente en el dispositivo y no se envía a servidores propios.<br/>
            <strong>2.2 Conversaciones y contenido</strong><br/>Los mensajes en la sección Guía se utilizan únicamente para generar respuestas en tiempo real mediante IA. No se almacenan como historial ni se asocian a perfiles personales.
          </p>
          <p><strong>3. Uso de la información</strong><br/>Utilizamos la información únicamente para:
            <ul style={{ paddingLeft: '20px' }}>
              <li>Personalizar la experiencia del usuario.</li>
              <li>Proporcionar respuestas relevantes en la Guía Espiritual.</li>
              <li>Mejorar el funcionamiento general de la App.</li>
            </ul>
          </p>
          <p><strong>4. Uso de servicios de terceros</strong><br/>La App utiliza servicios como OpenAI para generar respuestas. El texto se procesa de acuerdo con sus políticas. No vendemos ni compartimos datos personales con fines comerciales.</p>
          <p><strong>5. Almacenamiento y seguridad</strong><br/>La información básica se almacena localmente. Tomamos medidas razonables para proteger la información, aunque ningún sistema es completamente seguro.</p>
          <p><strong>6. Derechos del usuario</strong><br/>El usuario puede eliminar sus datos borrando la App o restableciendo su configuración.</p>
          <p><strong>7. Menores de edad</strong><br/>La App no está dirigida a menores de 13 años. Los tutores pueden contactarnos para solicitar la eliminación de cualquier información proporcionada por un menor.</p>
          <p><strong>8. Cambios a esta política</strong><br/>Nos reservamos el derecho de actualizar esta política. Los cambios se reflejarán en esta sección.</p>
          <p><strong>9. Contacto</strong><br/>Correo de contacto: </p>
        </div>
      )
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            backgroundColor: 'var(--background)', 
            borderTop: '4px solid var(--accent)',
            padding: '25px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{content[modalContent].title}</h2>
              <button onClick={() => setModalContent(null)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ color: 'var(--primary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{content[modalContent].text}</div>
            <button className="primary-button" style={{ marginTop: '20px', padding: '15px' }} onClick={() => setModalContent(null)}>Entendido</button>
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
  const [lastQuoteImgId, setLastQuoteImgId] = useState(null);
  const [availableBackgrounds, setAvailableBackgrounds] = useState([]);
  const [paywallMessage, setPaywallMessage] = useState({
    title: 'Escucha tu oración diaria',
    desc: 'Comienza tu prueba de 7 días gratis.<br/> Después solo <strong>$390 MXN/año</strong>.'
  });

  const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const handleDayClick = async (dateStr, isMissed) => {
    if (!isMissed) return;
    
    if (!isPremium) {
      setPaywallMessage({
        title: "Recupera tu racha",
        desc: "Como usuario Premium, puedes desbloquear días pasados y nunca perder tu progreso.<br/>Prueba 7 días gratis."
      });
      setShowPaywall(true);
      return;
    }
    
    // Lógica para Premium: Desbloquear día
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      const { error } = await supabase
        .from('daily_progress')
        .upsert({
          user_id: deviceId,
          fecha: dateStr,
          cita_completada: true,
          lectura_completada: true,
          reflexion_completada: true
        }, { onConflict: 'user_id,fecha' });
        
      if (error) throw error;
      
      setCompletedDays(prev => ({ ...prev, [dateStr]: true }));
      alert("¡Día recuperado! Tu racha se mantiene firme.");
    } catch (e) {
      console.error("Error al desbloquear día:", e);
    }
  };

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const { data, error } = await supabase.storage.from('backgrounds').list('', {
          limit: 150,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });
        
        if (error) throw error;
        if (data) {
          // Filtrar archivos que tengan extensiones válidas y no sean carpetas
          const files = data.filter(file => 
            file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i)
          );
          setAvailableBackgrounds(files.map(f => f.name));
        }
      } catch (e) {
        console.error("Error al cargar lista de fondos:", e);
      }
    };
    fetchBackgrounds();
  }, []);

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
    if (!isPremium) {
      setPaywallMessage({
        title: 'Escucha tu oración',
        desc: 'Prueba todas nuestras funciones premium gratis durante 7 días y escucha tu oración diaria.'
      });
      setShowPaywall(true);
      return;
    }
    
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    
    if (nextState) {
      const textToSpeak = `${content.versiculo}. ${content.cita}. ${content.reflexion}`;
      speakText(textToSpeak, () => setIsPlaying(false));
    } else {
      window.speechSynthesis.cancel();
    }
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
    let selectedFile;
    const supabaseUrl = 'https://elhncujrcvotrjpncfdg.supabase.co';
    
    if (availableBackgrounds.length > 0) {
      // Usar lista dinámica de Supabase
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
        selectedFile = availableBackgrounds[randomIndex];
      } while (selectedFile === lastQuoteImgId && availableBackgrounds.length > 1);
      
      setLastQuoteImgId(selectedFile);
      const bucketUrl = `${supabaseUrl}/storage/v1/object/public/backgrounds/${selectedFile}`;
      setBgImage(`${bucketUrl}?t=${Date.now()}`);
    } else {
      // Fallback por si la lista falla o está vacía (usando el método anterior)
      let randomImgNumber;
      do {
        randomImgNumber = Math.floor(Math.random() * 100) + 1;
      } while (randomImgNumber === lastQuoteImgId);
      
      setLastQuoteImgId(randomImgNumber);
      const bucketUrl = `${supabaseUrl}/storage/v1/object/public/backgrounds/${randomImgNumber}.jpg`;
      setBgImage(`${bucketUrl}?t=${Date.now()}`);
    }
    
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
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      backgroundImage: 'url("https://www.transparenttextures.com/patterns/papyros.png"), linear-gradient(rgba(253, 252, 240, 0.9), rgba(253, 252, 240, 0.9))',
      backgroundColor: '#f4ecd8', // Color base de papel antiguo
      position: 'relative'
    }}>
      {/* Sutil efecto de manchas de papel antiguo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: 0.4,
        background: 'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.02) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 50%)',
        zIndex: 0
      }} />
      
      <header className="header" style={{ padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
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
            
            // Un día se considera "perdido" si es pasado y no está completado
            const todayStart = new Date();
            todayStart.setHours(0,0,0,0);
            const isPast = dateForDay < todayStart;
            const isMissed = isPast && !isCompleted;
            
            return (
              <div 
                key={index} 
                onClick={() => handleDayClick(dateStr, isMissed)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '4px', 
                  position: 'relative', 
                  width: '30px',
                  cursor: isMissed ? 'pointer' : 'default'
                }}
              >
                <span style={{ 
                  fontSize: '1rem', 
                  fontWeight: 'bold', 
                  color: isMissed ? '#E57373' : (isToday || isCompleted) ? 'var(--accent)' : 'var(--text-gray)',
                  marginBottom: '2px'
                }}>
                  {day}
                </span>
                {isCompleted ? (
                  <Star size={16} color="var(--accent)" fill="var(--accent)" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />
                ) : isMissed ? (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E57373', opacity: 0.6 }} />
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
        <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ textAlign: 'left', fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8, marginBottom: '5px' }}>Mi Camino de Hoy</h3>
          
          {[
            { 
              id: 'cita', 
              label: 'Cita del Día', 
              icon: <Feather size={20} />, 
              action: openQuoteModal,
              image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80'
            },
            { 
              id: 'lectura', 
              label: 'Lectura Diaria', 
              icon: <Book size={20} />, 
              action: openReadingModal,
              image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80'
            },
            { 
              id: 'reflexion', 
              label: 'Mi Reflexión', 
              icon: <MessageSquare size={20} />, 
              action: () => setShowNoteModal(true) ,
              image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0',
                height: '85px',
                backgroundColor: 'var(--white)',
                borderRadius: '20px',
                border: '1px solid var(--divider)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow)',
                transition: 'all 0.2s ease',
                overflow: 'hidden'
              }}
            >
              {/* Imagen de Fondo */}
              <img 
                src={item.image} 
                alt={item.label} 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  opacity: 0.9
                }} 
              />
              
              {/* Overlay para Legibilidad */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
                zIndex: 1
              }} />

              {/* Contenido */}
              <div style={{ 
                position: 'relative', 
                zIndex: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                padding: '0 20px',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                <div style={{ 
                  color: 'var(--accent)', 
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  padding: '10px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {item.icon}
                </div>
                <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{item.label}</span>
              </div>

              {item.id !== 'reflexion' && (
                <div style={{ 
                  position: 'relative',
                  zIndex: 2,
                  marginRight: '20px',
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  border: `2.5px solid ${tareasCompletadas[item.id] ? '#D4AF37' : 'rgba(255,255,255,0.5)'}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: tareasCompletadas[item.id] ? '#D4AF37' : 'rgba(0,0,0,0.2)',
                  boxShadow: tareasCompletadas[item.id] ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none'
                }}>
                  {tareasCompletadas[item.id] && <CheckCircle size={14} color="white" fill="currentColor" />}
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
              <Feather size={40} color="#D4AF37" style={{ marginBottom: '20px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }} />
              <h2 style={{ 
                color: 'white', 
                fontSize: '1.8rem', 
                fontStyle: 'italic', 
                lineHeight: '1.4',
                marginBottom: '0px',
                textShadow: '3px 3px 15px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.5)'
              }}>
                "{quoteData?.phrase || 'Cargando cita...'}"
              </h2>
              <p style={{ 
                color: '#D4AF37', 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.4)' 
              }}>
                — {quoteData?.author || '...'}
              </p>

              {/* Botón de audio para la Cita */}
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '30px' }}>
                <button 
                  onClick={() => {
                    const nextState = !isPlaying;
                    setIsPlaying(nextState);
                    if (nextState) {
                      speakText(quoteData?.phrase, () => setIsPlaying(false));
                    } else {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    border: '1.5px solid rgba(255,255,255,0.4)', 
                    borderRadius: '50%', 
                    width: '60px', 
                    height: '60px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    color: 'white', 
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: 4 }} />}
                </button>
              </div>
            </div>

            <button 
              className="primary-button" 
              onClick={handleAmen}
              style={{ 
                position: 'absolute', 
                bottom: '60px', 
                backgroundColor: 'var(--accent)', 
                color: 'white',
                border: 'none',
                width: 'auto',
                padding: '14px 50px',
                zIndex: 10,
                borderRadius: '30px', 
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)',
                fontSize: '1.2rem',
                letterSpacing: '1px'
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
                  backgroundColor: 'var(--accent)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  border: 'none', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' 
                }}>
                  <div style={{ color: 'white' }}>
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
        <SubscriptionModal 
          title={paywallMessage.title}
          description={paywallMessage.desc}
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => {
            setShowPaywall(false);
            navigate('/profile', { state: { openPremium: true } });
          }}
        />
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
