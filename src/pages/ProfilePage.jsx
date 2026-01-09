import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Camera, ChevronLeft, Settings as SettingsIcon, Loader2, Heart, ChevronRight } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState({
    name: 'Francisco',
    email: '',
    photo: null
  });

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email, photo')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data);
      }
    } catch (err) {
      console.log('Error fetching profile:', err);
    }
  };

  const fetchFavorites = async () => {
    // Demo data for favorites
    setFavorites([
      { id: 1, title: 'Salmo 23:1', text: 'El Señor es mi pastor...' },
      { id: 2, title: 'Salmo 91:1', text: 'El que habita al abrigo...' }
    ]);
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

      setProfile({ ...profile, photo: publicUrl });
      
    } catch (error) {
      alert('Error al subir imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id || '00000000-0000-0000-0000-000000000000',
          name: profile.name,
          email: profile.email,
          photo: profile.photo,
          updated_at: new Date()
        });

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

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              {favorites.map(fav => (
                <div key={fav.id} style={{ padding: '15px', borderRadius: '12px', backgroundColor: 'var(--white)', border: '1px solid var(--divider)', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                  <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '5px' }}>{fav.title}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.8 }}>{fav.text}</p>
                </div>
              ))}
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
    </div>
  );
};

export default ProfilePage;

