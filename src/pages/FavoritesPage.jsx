import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronLeft, Heart, X, Play, Pause } from 'lucide-react';
import { speakText } from '../utils/tts';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const storedIds = JSON.parse(localStorage.getItem('mis_favoritos') || '[]');
      if (storedIds.length === 0) {
        setFavorites([]);
        return;
      }

      const { data, error } = await supabase
        .from('daily_content')
        .select('id, versiculo, cita, reflexion, audio_url')
        .in('id', storedIds);

      if (error) throw error;
      
      const mappedFavorites = data.map(f => ({
        id: f.id,
        title: f.cita,
        text: f.versiculo,
        fullContent: f
      }));

      // Mantener el orden del localStorage
      const sortedFavorites = storedIds
        .map(id => mappedFavorites.find(f => f.id === id))
        .filter(Boolean)
        .reverse();

      setFavorites(sortedFavorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (e, contentId) => {
    e.stopPropagation();
    try {
      const storedIds = JSON.parse(localStorage.getItem('mis_favoritos') || '[]');
      const newIds = storedIds.filter(id => id !== contentId);
      localStorage.setItem('mis_favoritos', JSON.stringify(newIds));
      
      setFavorites(favorites.filter(f => f.id !== contentId));
      if (selectedFavorite?.id === contentId) setSelectedFavorite(null);
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleToggleModalFavorite = () => {
    if (!selectedFavorite) return;
    handleRemoveFavorite({ stopPropagation: () => {} }, selectedFavorite.id);
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', padding: '30px' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
          <ChevronLeft size={28} />
        </button>
        <h1 style={{ marginLeft: '15px', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Todos mis Favoritos</h1>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--primary)' }}>Cargando tus favoritos...</p>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.6, color: 'var(--primary)' }}>
          <Heart size={64} style={{ marginBottom: '20px' }} />
          <p>Aún no tienes favoritos guardados.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {favorites.map(fav => (
            <div 
              key={fav.id} 
              onClick={() => setSelectedFavorite(fav.fullContent)}
              style={{ 
                padding: '20px', 
                borderRadius: '20px', 
                backgroundColor: 'var(--white)', 
                border: '1px solid var(--divider)', 
                boxShadow: 'var(--shadow)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px' }}>{fav.title}</p>
                <Heart 
                  size={18} 
                  color="var(--accent)" 
                  fill="var(--accent)" 
                  onClick={(e) => handleRemoveFavorite(e, fav.id)}
                />
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--primary)', opacity: 0.9, lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{fav.text}"
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedFavorite && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSelectedFavorite(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            backgroundColor: 'var(--background)', 
            padding: '25px', 
            borderRadius: '32px', 
            maxWidth: '95%',
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid var(--divider)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold' }}>Lectura Guardada</h2>
              <button onClick={() => setSelectedFavorite(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                <X size={28} />
              </button>
            </div>

            <div className="daily-card" style={{ 
              backgroundColor: 'var(--white)', 
              position: 'relative', 
              margin: '0 auto', 
              width: '92%', 
              boxShadow: 'var(--shadow)', 
              border: '1px solid var(--divider)',
              padding: '30px 20px 20px',
              borderRadius: '24px',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{selectedFavorite.cita}</p>
              <h2 className="verse-text" style={{ color: 'var(--primary)', fontSize: '1.4rem', marginBottom: '15px', fontStyle: 'italic', lineHeight: '1.4' }}>"{selectedFavorite.versiculo}"</h2>
              <div className="card-divider" style={{ margin: '15px auto', height: '1px', backgroundColor: 'var(--divider)', width: '60%' }}></div>
              <p className="reflection-text" style={{ textAlign: 'justify', color: 'var(--primary)', fontSize: '1rem', lineHeight: '1.5', marginBottom: '20px' }}>{selectedFavorite.reflexion}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ width: '3px', height: `${10 + Math.random()*20}px`, backgroundColor: 'var(--accent)', borderRadius: '3px' }}></div>)}
                </div>
                <button 
                  onClick={() => {
                    const nextState = !isPlaying;
                    setIsPlaying(nextState);
                    if (nextState) {
                      const textToSpeak = `${selectedFavorite.versiculo}. ${selectedFavorite.cita}. ${selectedFavorite.reflexion}`;
                      speakText(textToSpeak, () => setIsPlaying(false));
                    } else {
                      window.speechSynthesis.cancel();
                    }
                  }} 
                  style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                >
                  <div style={{ color: 'var(--accent)' }}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: 2 }} />}
                  </div>
                </button>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ width: '3px', height: `${10 + Math.random()*20}px`, backgroundColor: 'var(--accent)', borderRadius: '3px' }}></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
