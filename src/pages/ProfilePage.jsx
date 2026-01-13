import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Camera, ChevronLeft, Settings as SettingsIcon, Loader2, Heart, ChevronRight, X, Play, Pause, Crown, Check, BookOpen, PenLine } from 'lucide-react';
import { speakText } from '../utils/tts';

const ProfilePage = ({ isPremium, setIsPremium, userName, setUserName, avatarUrl, setAvatarUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(location.state?.openPremium || false);
  const [selectedPlan, setSelectedPlan] = useState(location.state?.selectedPlan || 'monthly');

  const handleActivatePremium = async () => {
    if (isPremium) return;
    setLoading(true);
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      
      // Calcular fecha de expiración (7 días a partir de hoy)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      console.log('Intentando activar premium para:', deviceId);

      // Intentar primero con todas las columnas nuevas
      const { error: fullError } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          premium_until: expirationDate.toISOString(),
          subscription_plan: selectedPlan,
          is_trial: true
        })
        .eq('id', deviceId);
      
      if (fullError) {
        console.warn('Fallo al actualizar con todas las columnas, intentando solo is_premium:', fullError.message);
        
        // Fallback: solo activar la columna principal que sabemos que existe
        const { error: simpleError } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('id', deviceId);
          
        if (simpleError) throw simpleError;
      }
      
      setIsPremium(true);
      setShowPremiumModal(false);
    } catch (err) {
      console.error('Error final al activar premium:', err.message);
      alert('Error al activar el acceso. Por favor, intenta de nuevo o contacta a soporte.');
    } finally {
      setLoading(false);
    }
  };
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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '320px' }}>
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

        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 'bold', margin: '0' }}>{profile.name}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginBottom: '15px' }}>
            <button 
              className="primary-button" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                backgroundColor: isPremium ? 'var(--accent)' : 'var(--primary)', 
                color: isPremium ? 'white' : 'var(--background)',
                boxShadow: isPremium ? '0 4px 10px rgba(212, 175, 55, 0.2)' : '0 4px 10px rgba(26, 43, 72, 0.2)',
                border: 'none'
              }} 
              onClick={() => setShowPremiumModal(true)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Crown size={20} fill="currentColor" />
                <span>{isPremium ? 'Premium' : 'Acceso Total'}</span>
              </div>
            </button>

            <button 
              className="primary-button" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem' 
              }} 
              onClick={handleSave} 
              disabled={loading || uploading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

          {/* Sección de Diario */}
          <div style={{ width: '100%', borderTop: '1px solid var(--divider)', paddingTop: '15px' }}>
            <button 
              onClick={() => navigate('/diario')}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', width: '100%', padding: '10px 0', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <PenLine size={24} color="var(--primary)" />
                Mi Diario Personal
              </div>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Sección de Favoritos */}
          <div style={{ width: '100%', borderTop: '1px solid var(--divider)', paddingTop: '5px' }}>
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', width: '100%', padding: '10px 0', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}
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
                        style={{ 
                          padding: '5px 15px', 
                          borderRadius: '12px', 
                          backgroundColor: 'var(--white)', 
                          border: '1px solid var(--divider)', 
                          boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
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

          <div style={{ width: '100%', borderTop: '1px solid var(--divider)', paddingTop: '5px' }}>
            <button 
              onClick={() => navigate('/settings')}
              style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'none', border: 'none', width: '100%', padding: '10px 0', cursor: 'pointer', fontSize: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}
            >
              <SettingsIcon size={24} /> Configuración
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Modal Premium (Paywall) */}
      {showPremiumModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }} onClick={() => setShowPremiumModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            backgroundColor: 'var(--background)', 
            borderRadius: '32px', 
            maxWidth: '90%',
            width: '380px',
            overflow: 'hidden',
            border: '1px solid var(--divider)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Imagen Superior (Estilo Tablero de Iglesia) */}
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <img 
                src="/biblia.jpg" 
                alt="Acceso Total" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--background))' }}></div>
              <button 
                onClick={() => setShowPremiumModal(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <Crown size={32} color="var(--accent)" fill="var(--accent)" />
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '10px' }}>Acceso Total</h2>
              <p style={{ color: 'var(--primary)', opacity: 0.7, fontSize: '1rem', lineHeight: '1.5', marginBottom: '15px' }}>
                Desbloquea todas las funciones, meditaciones guiadas e IA Espiritual ilimitada.
              </p>

              {/* Opciones de Planes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '5px' }}>
                  Comienza con 7 días gratis
                </p>
                <div 
                  onClick={() => setSelectedPlan('monthly')}
                  style={{ 
                    padding: '2px 12px', 
                    borderRadius: '8px', 
                    border: `1.5px solid ${selectedPlan === 'monthly' ? 'var(--accent)' : 'var(--divider)'}`,
                    backgroundColor: selectedPlan === 'monthly' ? 'rgba(212, 175, 55, 0.05)' : 'var(--white)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: '0.1s'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.05rem' }}>Mensual</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--primary)', opacity: 0.6 }}>Cancela cuando quieras</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.05rem' }}>$49 MXN</p>
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedPlan('yearly')}
                  style={{ 
                    padding: '2px 12px', 
                    borderRadius: '8px', 
                    border: `1.5px solid ${selectedPlan === 'yearly' ? 'var(--accent)' : 'var(--divider)'}`,
                    backgroundColor: selectedPlan === 'yearly' ? 'rgba(212, 175, 55, 0.05)' : 'var(--white)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: '0.1s',
                    position: 'relative'
                  }}
                >
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.05rem' }}>Anual</p>
                      <span style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '0.55rem', fontWeight: 'bold' }}>
                        OFERTA
                      </span>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--primary)', opacity: 0.6 }}>Cancela cuando quieras</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.05rem' }}>$499 MXN</p>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.65rem', color: 'var(--primary)', opacity: 0.5, textAlign: 'justify', marginBottom: '15px', lineHeight: '1.3' }}>
                Tu prueba gratuita de 7 días se convertirá automáticamente en una suscripción de pago a menos que la canceles al menos 24 horas antes de que finalice el período de prueba. Puedes cancelar en cualquier momento desde la configuración de tu cuenta.
              </p>

              <button 
                className="primary-button" 
                onClick={handleActivatePremium}
                disabled={loading || isPremium}
                style={{ width: '100%', backgroundColor: 'var(--accent)', color: 'white', padding: '15px' }}
              >
                {loading ? 'Procesando...' : (isPremium ? 'Ya eres Premium' : 'Comenzar ahora')}
              </button>
              
              <p 
                onClick={() => window.open('https://play.google.com/store/account/subscriptions', '_blank')}
                style={{ marginTop: '15px', fontSize: '0.75rem', color: 'var(--primary)', opacity: 0.6, cursor: 'pointer', textDecoration: 'underline' }}
              >
                ¿Deseas gestionar o cancelar tu suscripción?
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
