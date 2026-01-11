import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Camera, ChevronLeft, Settings as SettingsIcon, Loader2, Heart, ChevronRight, X, Play, Pause } from 'lucide-react';

const ProfilePage = ({ userName, setUserName, avatarUrl, setAvatarUrl }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [profile, setProfile] = useState({
    name: userName || 'Francisco',
    email: '',
    avatar_url: avatarUrl || null
  });

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
  }, []);

  const fetchProfile = async () => {
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      if (deviceId) {
        const { data } = await supabase
          .from('profiles')
          .select('name, email, avatar_url')
          .eq('id', deviceId)
          .maybeSingle();
        
        if (data) {
          setProfile(data);
          if (data.name) setUserName(data.name);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      }
    } catch (err) {
      console.log('Error fetching profile:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
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
        title: f.versiculo,
        text: f.cita,
        fullContent: f
      }));

      // Mantener el orden del localStorage (más recientes primero)
      const sortedFavorites = storedIds
        .map(id => mappedFavorites.find(f => f.id === id))
        .filter(Boolean)
        .reverse();

      setFavorites(sortedFavorites);
    } catch (err) {
      console.error('Error fetching favorites from LocalStorage:', err);
    }
  };

  const handleFileSelect = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Actualizar inmediatamente la tabla profiles usando el deviceId local (Modo Anónimo)
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      if (deviceId) {
        const { error: dbError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', deviceId);
        
        if (dbError) throw dbError;
      }

      setProfile({ ...profile, avatar_url: publicUrl });
      setAvatarUrl(publicUrl);
      
    } catch (error) {
      console.error('Error detallado:', error);
      alert('Error al procesar la imagen: ' + (error.message || 'Error de permisos RLS'));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      if (!deviceId) throw new Error('Error de identidad del dispositivo');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          updated_at: new Date()
        })
        .eq('id', deviceId);

      if (error) throw error;
      alert('Perfil guardado con éxito');
      navigate('/home');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar: ' + error.message);
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
      console.error('Error removing favorite from LocalStorage:', err);
    }
  };

  const handleToggleModalFavorite = () => {
    if (!selectedFavorite) return;
    handleRemoveFavorite({ stopPropagation: () => {} }, selectedFavorite.id);
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', width: '100%', maxWidth: '360px' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
          <ChevronLeft size={28} />
        </button>
        <h1 style={{ marginLeft: '20px', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Mi Perfil</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', width: '100%', maxWidth: '320px' }}>
        {/* Foto de Perfil */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleFileSelect}
        />
        
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => !uploading && fileInputRef.current.click()}
            style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent)', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              fontSize: '3rem', 
              color: 'white', 
              cursor: uploading ? 'default' : 'pointer',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
            }}
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ opacity: uploading ? 0.3 : 1 }}>{profile.name ? profile.name[0] : 'F'}</span>
            )}
            
            {uploading && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={24} color="white" />
              </div>
            )}
          </div>
          
          {!uploading && (
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                position: 'absolute', 
                bottom: '0', 
                right: '0', 
                backgroundColor: 'var(--primary)', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                border: '2px solid var(--background)',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <Camera size={16} color="var(--background)" />
            </div>
          )}
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8, fontWeight: 'bold' }}>Nombre</label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--divider)', backgroundColor: 'var(--white)', color: 'var(--primary)', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', opacity: 0.8, fontWeight: 'bold' }}>Correo (Opcional)</label>
            <input 
              type="email" 
              value={profile.email} 
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--divider)', backgroundColor: 'var(--white)', color: 'var(--primary)', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button className="primary-button" style={{ width: '100%' }} onClick={handleSave} disabled={loading || uploading}>
          {loading ? 'Guardando...' : 'Guardar Perfil'}
        </button>

        {/* Sección de Favoritos */}
        <div style={{ width: '100%', borderTop: '1px solid var(--divider)', paddingTop: '20px' }}>
          <button 
            onClick={() => setShowFavorites(!showFavorites)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', width: '100%', padding: '15px 0', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Heart size={24} color={favorites.length > 0 ? "var(--accent)" : "var(--primary)"} fill={favorites.length > 0 ? "var(--accent)" : "none"} />
              Favoritos ({favorites.length})
            </div>
            <ChevronRight size={20} style={{ transform: showFavorites ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }} />
          </button>
          
          {showFavorites && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {favorites.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.9rem', padding: '10px' }}>No tienes favoritos aún</p>
              ) : (
                <>
                  {favorites.slice(0, 3).map(fav => (
                    <div 
                      key={fav.id} 
                      onClick={() => setSelectedFavorite(fav.fullContent)}
                      style={{ 
                        padding: '5px 15px', 
                        borderRadius: '12px', 
                        backgroundColor: 'var(--white)', 
                        border: '1px solid var(--divider)', 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '4px' }}>{fav.title}</p>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--primary)', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{fav.text}</p>
                    </div>
                  ))}
                  {favorites.length > 3 && (
                    <button 
                      onClick={() => navigate('/favorites')}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer', padding: '10px', fontSize: '0.9rem' }}
                    >
                      Ver más...
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ width: '100%', borderTop: '1px solid var(--divider)', paddingTop: '10px' }}>
          <button 
            onClick={() => navigate('/settings')}
            style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'none', border: 'none', width: '100%', padding: '15px 0', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}
          >
            <SettingsIcon size={24} /> Configuración
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Modal Lectura Diaria (Reutilizado para Favoritos) */}
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
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold' }}>Favorito</h2>
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
              <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{selectedFavorite.versiculo}</p>
              <h2 className="verse-text" style={{ color: 'var(--primary)', fontSize: '1.4rem', marginBottom: '15px', fontStyle: 'italic', lineHeight: '1.4' }}>"{selectedFavorite.cita}"</h2>
              <div className="card-divider" style={{ margin: '15px auto', height: '1px', backgroundColor: 'var(--divider)', width: '60%' }}></div>
              <p className="reflection-text" style={{ textAlign: 'justify', color: 'var(--primary)', fontSize: '1rem', lineHeight: '1.5', marginBottom: '20px' }}>{selectedFavorite.reflexion}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ width: '3px', height: `${10 + Math.random()*20}px`, backgroundColor: 'var(--accent)', borderRadius: '3px' }}></div>)}
                </div>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  <div style={{ color: 'var(--accent)' }}>
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: 4 }} />}
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

export default ProfilePage;

