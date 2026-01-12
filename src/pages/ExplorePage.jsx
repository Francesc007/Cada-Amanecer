import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Play, BookOpen, Clock, Star, Crown, Heart, Wind, Moon, Shield, Sparkles, Loader2 } from 'lucide-react';
import { PremiumBadge } from '../components/Navigation';
import { supabase } from '../lib/supabase';

const ExplorePage = ({ isPremium }) => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('Todos');
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const moods = [
    { id: 'Todos', label: 'Todos', icon: <Sparkles size={16} /> },
    { id: 'Ansiedad', label: 'Ansiedad', icon: <Wind size={16} /> },
    { id: 'Gratitud', label: 'Gratitud', icon: <Heart size={16} /> },
    { id: 'Sueño', label: 'Sueño', icon: <Moon size={16} /> },
    { id: 'Fortaleza', label: 'Fortaleza', icon: <Shield size={16} /> },
    { id: 'Perdón', label: 'Perdón', icon: <Sparkles size={16} /> }
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
    fetchPrayers();
  }, [selectedMood]);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('daily_content')
        .select('id, versiculo, cita, categoria');
      
      if (selectedMood !== 'Todos') {
        query = query.eq('categoria', selectedMood);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;
      setPrayers(data || []);
    } catch (err) {
      console.error('Error fetching filtered prayers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMoodImage = (mood) => {
    const images = {
      'Ansiedad': 'https://images.unsplash.com/photo-1499209974431-9eaa37a11144?auto=format&fit=crop&w=800&q=80',
      'Gratitud': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      'Sueño': 'https://images.unsplash.com/photo-1511295742364-917e703b1971?auto=format&fit=crop&w=800&q=80',
      'Fortaleza': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'Perdón': 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80',
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
        
        {/* Filtro por Etiquetas (Mosaico) */}
        <section>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '10px',
            marginBottom: '10px'
          }}>
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px 5px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--divider)',
                  backgroundColor: selectedMood === mood.id ? 'var(--primary)' : 'var(--white)',
                  color: selectedMood === mood.id ? 'var(--background)' : 'var(--primary)',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  boxShadow: selectedMood === mood.id ? '0 4px 10px rgba(26, 43, 72, 0.1)' : 'none',
                  textAlign: 'center'
                }}
              >
                <div style={{ opacity: 0.8 }}>{mood.icon}</div>
                {mood.label}
              </button>
            ))}
          </div>
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
                  height: '120px',
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
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{med.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '4px 0 0' }}>{med.duration} • Meditación</p>
                  </div>
                  <div style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
                  }}>
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                {!isPremium && <PremiumBadge />}
              </div>
            ))}
          </div>
        </section>

        {/* Lógica de Oraciones (Filtradas) */}
        <section>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={20} color="var(--accent)" /> 
            {selectedMood === 'Todos' ? 'Oraciones para ti' : `Oraciones para: ${selectedMood}`}
          </h3>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 size={30} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          ) : prayers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-gray)' }}>
              <p>No hay oraciones específicas para "{selectedMood}" en este momento.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              {prayers.map((prayer) => (
                <div 
                  key={prayer.id}
                  className="animate-fade-in"
                  style={{ 
                    position: 'relative',
                    height: '140px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--divider)'
                  }}
                >
                  <img src={getMoodImage(prayer.categoria)} alt={prayer.versiculo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px'
                  }}>
                    <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {prayer.categoria || 'DIARIO'}
                    </p>
                    <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{prayer.cita}"
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '5px' }}>{prayer.versiculo}</p>
                  </div>
                  {!isPremium && <PremiumBadge />}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default ExplorePage;
