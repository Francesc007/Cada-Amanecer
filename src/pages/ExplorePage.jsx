import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Play, BookOpen, Clock, Star, Crown, Heart, Wind, Moon, Shield, Sparkles, Loader2, Sprout, CheckCircle, Pause } from 'lucide-react';
import { PremiumBadge } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { speakText } from '../utils/tts';

const ExplorePage = ({ isPremium }) => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('todos');
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null); // Para la vista de detalle
  const [moodCounts, setMoodCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [lastImgId, setLastImgId] = useState(null);
  const [readPrayers, setReadPrayers] = useState(() => {
    const saved = localStorage.getItem('oraciones_leidas');
    return saved ? JSON.parse(saved) : [];
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgImage, setBgImage] = useState('');
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [availableBackgrounds, setAvailableBackgrounds] = useState([]);
  const pageSize = 10;

  const moods = [
    { id: 'todos', label: 'Todos', icon: <Sparkles size={16} /> },
    { id: 'paz', label: 'Paz', icon: <Wind size={16} /> },
    { id: 'gratitud', label: 'Gratitud', icon: <Heart size={16} /> },
    { id: 'sueño', label: 'Sueño', icon: <Moon size={16} /> },
    { id: 'fortaleza', label: 'Fortaleza', icon: <Shield size={16} /> },
    { id: 'perdón', label: 'Perdón', icon: <Sparkles size={16} /> },
    { id: 'esperanza', label: 'Esperanza', icon: <Sprout size={16} /> }
  ];

  const meditations = [
    { 
      id: 1, 
      title: 'Encuentra la Calma', 
      duration: '5 min', 
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80' 
    },
    { 
      id: 2, 
      title: 'Paz en la Tormenta', 
      duration: '10 min', 
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' 
    }
  ];

  useEffect(() => {
    fetchMoodCounts();
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      const { data, error } = await supabase.storage.from('backgrounds').list('', {
        limit: 150,
        offset: 0
      });
      if (!error && data) {
        const files = data.filter(file => file.name.match(/\.(jpg|jpeg|png|webp|avif)$/i));
        setAvailableBackgrounds(files.map(f => f.name));
      }
    } catch (e) {
      console.error("Error al cargar lista de fondos:", e);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchPrayers(1);
  }, [selectedMood]);

  const fetchMoodCounts = async () => {
    try {
      const counts = {};
      await Promise.all(moods.filter(m => m.id !== 'todos').map(async (mood) => {
        const { count, error } = await supabase
          .from('daily_content')
          .select('*', { count: 'exact', head: true })
          .eq('categoria', mood.id);
        if (!error) counts[mood.id] = count || 0;
      }));
      setMoodCounts(counts);
    } catch (err) {
      console.error('Error fetching mood counts:', err);
    }
  };

  const fetchPrayers = async (page = 1) => {
    if (selectedMood === 'todos') {
      setPrayers([]);
      return;
    }

    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('daily_content')
        .select('id, versiculo, cita, categoria, reflexion', { count: 'exact' });
      
      query = query.eq('categoria', selectedMood);

      const { data, error, count } = await query.range(from, to);
      if (error) throw error;
      
      setPrayers(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching filtered prayers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPrayer = (prayer) => {
    let selectedFile;
    const supabaseUrl = 'https://elhncujrcvotrjpncfdg.supabase.co';
    
    if (availableBackgrounds.length > 0) {
      // Usar lista dinámica de Supabase
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
        selectedFile = availableBackgrounds[randomIndex];
      } while (selectedFile === lastImgId && availableBackgrounds.length > 1);
      
      setLastImgId(selectedFile);
      const bucketUrl = `${supabaseUrl}/storage/v1/object/public/backgrounds/${selectedFile}`;
      setBgImage(`${bucketUrl}?t=${Date.now()}`);
    } else {
      // Fallback
      let randomImgNumber;
      do {
        randomImgNumber = Math.floor(Math.random() * 100) + 1;
      } while (randomImgNumber === lastImgId);
      
      setLastImgId(randomImgNumber);
      const bucketUrl = `${supabaseUrl}/storage/v1/object/public/backgrounds/${randomImgNumber}.jpg`;
      setBgImage(`${bucketUrl}?t=${Date.now()}`);
    }
    
    setSelectedPrayer(prayer);
    if (!readPrayers.includes(prayer.id)) {
      const newRead = [...readPrayers, prayer.id];
      setReadPrayers(newRead);
      localStorage.setItem('oraciones_leidas', JSON.stringify(newRead));
    }
  };

  const getMoodImage = (mood) => {
    const images = {
      'paz': 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&w=800&q=80',
      'gratitud': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      'sueño': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'fortaleza': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'perdón': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80',
      'esperanza': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
      'default': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80'
    };
    return images[mood] || images['default'];
  };

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        padding: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        borderBottom: '1px solid var(--divider)',
        backgroundColor: 'var(--background)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
          <ChevronLeft size={28} />
        </button>
        <h1 style={{ marginLeft: '15px', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Explora</h1>
      </header>

      <main style={{ flex: 1, padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Lógica de Oraciones (Filtradas o Mosaico) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Search size={20} color="var(--accent)" /> 
              {selectedMood === 'todos' ? 'Explora por categorías' : `Oraciones: ${moods.find(m => m.id === selectedMood)?.label}`}
            </h3>
            
            {selectedMood !== 'todos' && (
              <button 
                onClick={() => setSelectedMood('todos')}
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: 'none',
                  color: 'var(--accent)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <ChevronLeft size={14} /> Ver todas
              </button>
            )}
          </div>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 size={30} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : selectedMood === 'todos' ? (
            /* Vista de Mosaico para "Todos" */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              {moods.filter(m => m.id !== 'todos').map((mood) => (
                <div 
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  style={{
                    position: 'relative',
                    height: '110px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--divider)'
                  }}
                >
                  <img src={getMoodImage(mood.id)} alt={mood.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '10px'
                  }}>
                    <div style={{ color: 'var(--accent)', marginBottom: '5px' }}>{mood.icon}</div>
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{mood.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', margin: '4px 0 0' }}>
                      {moodCounts[mood.id] || 0} oraciones
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Lista de Oraciones para una Categoría */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                {prayers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
                    <p>No hay oraciones específicas para "{selectedMood}" en este momento.</p>
                  </div>
                ) : (
                  prayers.map((prayer) => (
                    <div 
                      key={prayer.id}
                      className="animate-fade-in"
                      onClick={() => handleOpenPrayer(prayer)}
                      style={{ 
                        position: 'relative',
                        height: '110px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow)',
                        border: '1px solid var(--divider)'
                      }}
                    >
                      <img src={getMoodImage(prayer.categoria)} alt={prayer.cita} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {/* Ícono de Leído */}
                      {readPrayers.includes(prayer.id) && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '50%',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 5
                        }}>
                          <CheckCircle size={16} color="var(--accent)" fill="var(--accent)" />
                        </div>
                      )}

                      <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '15px 20px'
                      }}>
                        <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                          {prayer.cita || 'DIARIO'}
                        </p>
                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>
                          {prayer.versiculo}
                        </p>
                      </div>
                      {!isPremium && <PremiumBadge />}
                    </div>
                  ))
                )}
              </div>

              {/* Paginación */}
              {totalCount > pageSize && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginTop: '10px' 
                }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => {
                        const newPage = currentPage - 1;
                        setCurrentPage(newPage);
                        fetchPrayers(newPage);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--divider)',
                        backgroundColor: currentPage === 1 ? 'var(--background)' : 'var(--white)',
                        color: 'var(--primary)',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.5 : 1
                      }}
                    >
                      Anterior
                    </button>
                    <button 
                      disabled={currentPage * pageSize >= totalCount}
                      onClick={() => {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        fetchPrayers(newPage);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--divider)',
                        backgroundColor: currentPage * pageSize >= totalCount ? 'var(--background)' : 'var(--white)',
                        color: 'var(--primary)',
                        cursor: currentPage * pageSize >= totalCount ? 'not-allowed' : 'pointer',
                        opacity: currentPage * pageSize >= totalCount ? 0.5 : 1
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                    {Math.min((currentPage - 1) * pageSize + 1, totalCount)}-{Math.min(currentPage * pageSize, totalCount)} de {totalCount} total
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Sección de Meditación (Estilo Reproductor) */}
        <section>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--accent)" /> Meditaciones Guiadas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {meditations.map((med) => (
              <div 
                key={med.id}
                className="animate-scale-in"
                style={{ 
                  position: 'relative',
                  height: '110px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--divider)'
                }}
              >
                <img src={med.image} alt={med.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 25px',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.05rem', margin: 0 }}>{med.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: '4px 0 0' }}>{med.duration} • Meditación</p>
                  </div>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
                  }}>
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>
                {!isPremium && <PremiumBadge />}
              </div>
            ))}
          </div>
        </section>

      </main>


      {/* Vista de Detalle (Overlay Estilo Cita del Día) */}
      {selectedPrayer && (
        <div style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'black',
          zIndex: 3000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          {/* Overlay sutil para legibilidad, maximizando la nitidez */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            backdropFilter: 'contrast(1.2) saturate(1.1)',
            zIndex: 1
          }} />

          {/* Botón Volver */}
          <button 
            onClick={() => {
              setSelectedPrayer(null);
              setIsPlaying(false);
              setPlaybackProgress(0);
            }} 
            style={{ 
              position: 'absolute',
              top: '25px',
              left: '20px',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              color: 'white',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
          >
            <ChevronLeft size={28} />
          </button>

          <main style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '40px 30px',
            position: 'relative',
            zIndex: 2,
            textAlign: 'center'
          }}>
            <Heart size={40} color="var(--accent)" fill="var(--accent)" style={{ marginBottom: '25px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }} />
            
            <h2 style={{ 
              color: 'var(--accent)', 
              fontSize: '1rem', 
              letterSpacing: '3px', 
              textTransform: 'uppercase',
              fontWeight: 'bold',
              marginBottom: '15px',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.4)'
            }}>
              {selectedMood === 'todos' ? selectedPrayer.categoria : selectedPrayer.cita}
            </h2>

            <p style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              color: 'white', 
              lineHeight: '1.3',
              fontStyle: 'italic',
              marginBottom: '30px',
              textShadow: '3px 3px 15px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.5)'
            }}>
              "{selectedPrayer.versiculo}"
            </p>

            <div style={{ 
              height: '2px', 
              backgroundColor: 'rgba(212, 175, 55, 0.8)', 
              width: '80px', 
              marginBottom: '30px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }} />

            <div style={{ 
              maxHeight: '30vh',
              overflowY: 'auto',
              marginBottom: '40px',
              padding: '0 10px'
            }} className="custom-scrollbar">
              <p style={{ 
                fontSize: '1.15rem', 
                color: 'rgba(255,255,255,0.98)', 
                lineHeight: '1.6',
                textAlign: 'justify',
                whiteSpace: 'pre-wrap',
                textShadow: '2px 2px 10px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.5)'
              }}>
                {selectedPrayer.reflexion}
              </p>
            </div>

            {/* Controles de Reproducción */}
            <div style={{ width: '100%', maxWidth: '300px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
                <button 
                  onClick={() => {
                    const nextState = !isPlaying;
                    setIsPlaying(nextState);
                    if (nextState) {
                      const textToSpeak = `"${selectedPrayer.versiculo}". ${selectedPrayer.reflexion}`;
                      speakText(textToSpeak, () => setIsPlaying(false));
                    } else {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  style={{ 
                    width: '55px', 
                    height: '55px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    border: 'none', 
                    cursor: 'pointer', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    color: 'var(--primary)',
                    backdropFilter: 'blur(5px)',
                    padding: 0,
                    flexShrink: 0
                  }}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: 4 }} />}
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
