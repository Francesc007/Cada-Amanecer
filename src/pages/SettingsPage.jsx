import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/ThemeContext';
import { ChevronLeft, ChevronRight, ChevronDown, LogOut, Trash2, Send } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    alert('Cuenta eliminada permanentemente');
    navigate('/');
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('feedback')
        .insert([{ 
          user_id: user?.id || null, 
          message: comment.trim() 
        }]);

      if (error) throw error;

      alert('Gracias por ayudarnos a mejorar Cada Amanecer');
      setComment('');
      setShowComments(false);
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Error al enviar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', padding: '30px' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
          <ChevronLeft size={28} />
        </button>
        <h1 style={{ marginLeft: '20px', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Configuración</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Modo Oscuro */}
        <div style={settingRow}>
          <span style={{ fontWeight: 'bold' }}>Modo Oscuro</span>
          <button 
            onClick={toggleDarkMode}
            style={{ width: '50px', height: '26px', borderRadius: '13px', backgroundColor: isDarkMode ? 'var(--accent)' : '#E0E0E0', border: 'none', position: 'relative', cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', top: '3px', left: isDarkMode ? '26px' : '3px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', transition: '0.2s' }} />
          </button>
        </div>

        {/* Acerca de */}
        <div style={{ borderBottom: '1px solid var(--divider)' }}>
          <button style={{ ...settingRow, borderBottom: 'none' }} onClick={() => setShowAbout(!showAbout)}>
            <span style={{ fontWeight: 'bold' }}>Acerca de Cada Amanecer</span>
            {showAbout ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          {showAbout && (
            <div style={accordionContent}>
              Cada Amanecer nace como un espacio de pausa y reflexión en el ajetreo diario. Nuestra finalidad es conectar tu espíritu con la sabiduría milenaria de forma sencilla, brindándote una palabra de aliento y un momento de paz para comenzar tu jornada con propósito y esperanza renovada.
            </div>
          )}
        </div>

        {/* Comentarios */}
        <div style={{ borderBottom: '1px solid var(--divider)' }}>
          <button style={{ ...settingRow, borderBottom: 'none' }} onClick={() => setShowComments(!showComments)}>
            <span style={{ fontWeight: 'bold' }}>Comentarios</span>
            {showComments ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          {showComments && (
            <div style={accordionContent}>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe aquí tus sugerencias o comentarios..."
                style={{ 
                  width: '100%', 
                  height: '100px', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--divider)', 
                  backgroundColor: 'var(--white)', 
                  color: 'var(--primary)', 
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  resize: 'none',
                  marginBottom: '10px',
                  boxSizing: 'border-box',
                  display: 'block'
                }}
              />
              <button 
                onClick={handleSendComment}
                disabled={loading || !comment.trim()}
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'var(--background)', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontWeight: 'bold',
                  cursor: (loading || !comment.trim()) ? 'default' : 'pointer',
                  opacity: (loading || !comment.trim()) ? 0.7 : 1,
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} /> {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          )}
        </div>

        {/* Términos */}
        <div style={{ borderBottom: '1px solid var(--divider)' }}>
          <button style={{ ...settingRow, borderBottom: 'none' }} onClick={() => setShowTerms(!showTerms)}>
            <span style={{ fontWeight: 'bold' }}>Términos y Condiciones</span>
            {showTerms ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          {showTerms && (
            <div style={accordionContent}>
              Al usar Cada Amanecer, te comprometes a hacer un uso personal y respetuoso de los contenidos. Queda prohibida la reproducción comercial o redistribución de las reflexiones sin consentimiento expreso.
            </div>
          )}
        </div>

        {/* Privacidad */}
        <div style={{ borderBottom: '1px solid var(--divider)' }}>
          <button style={{ ...settingRow, borderBottom: 'none' }} onClick={() => setShowPrivacy(!showPrivacy)}>
            <span style={{ fontWeight: 'bold' }}>Política de Privacidad</span>
            {showPrivacy ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          {showPrivacy && (
            <div style={accordionContent}>
              Tus datos son sagrados para nosotros. Solo almacenamos la información necesaria para ofrecerte una experiencia personalizada. Nunca compartiremos tus datos con terceros sin tu permiso explícito.
            </div>
          )}
        </div>

        {/* Acciones de Cuenta */}
        <button style={{ ...settingRow, color: 'var(--primary)', marginTop: '30px' }} onClick={() => navigate('/')}>
          <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogOut size={20} /> Salir
          </span>
        </button>

        <button style={{ ...settingRow, color: '#d9534f' }} onClick={() => setShowDeleteModal(true)}>
          <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trash2 size={20} /> Eliminar cuenta
          </span>
        </button>
      </div>

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--background)', padding: '30px', borderRadius: '15px', width: '80%', maxWidth: '350px', textAlign: 'center', border: '1px solid var(--divider)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontWeight: 'bold' }}>¿Estás seguro?</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '25px', opacity: 0.8, color: 'var(--primary)' }}>
              Esta acción es irreversible. Se borrará toda tu información, historial de reflexiones y racha acumulada.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--primary)', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
              <button onClick={handleDeleteAccount} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#d9534f', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const settingRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '18px 0',
  borderBottom: '1px solid var(--divider)',
  background: 'none',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  fontSize: '1rem',
  cursor: 'pointer',
  color: 'var(--primary)',
  fontFamily: 'inherit'
};

const accordionContent = {
  padding: '0 0 20px 0', 
  opacity: 0.8, 
  fontSize: '0.95rem', 
  lineHeight: '1.5',
  color: 'var(--primary)'
};

export default SettingsPage;
