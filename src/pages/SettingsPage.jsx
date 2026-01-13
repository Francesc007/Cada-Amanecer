import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/ThemeContext';
import { ChevronLeft, ChevronRight, ChevronDown, LogOut, Trash2, Send, X } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openSection, setOpenSection] = useState(null); // 'about', 'comments'
  const [modalContent, setModalContent] = useState(null); // 'terms', 'privacy'
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const policyContent = {
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

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      if (!deviceId) return;

      console.log('Iniciando eliminación de cuenta para:', deviceId);

      // 1. Eliminar datos relacionados primero (por si no hay CASCADE)
      await supabase.from('daily_progress').delete().eq('user_id', deviceId);
      await supabase.from('user_reflections').delete().eq('user_id', deviceId);

      // 2. Eliminar el perfil de Supabase
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;

      // 3. Limpiar LocalStorage (BORRADO TOTAL)
      localStorage.clear();

      alert('Tu cuenta y todos tus datos han sido eliminados permanentemente.');
      
      // 4. Reiniciar la aplicación completamente para generar un nuevo deviceId
      window.location.href = '/';
    } catch (error) {
      console.error('Error detallado al eliminar cuenta:', error);
      alert('No pudimos eliminar tu cuenta: ' + error.message);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    
    setLoading(true);
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      
      const { error } = await supabase
        .from('feedback')
        .insert([{ 
          user_id: deviceId, 
          message: comment.trim() 
        }]);

      if (error) throw error;

      alert('Gracias por ayudarnos a mejorar Cada Amanecer');
      setComment('');
      setOpenSection(null);
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
          <button style={{ ...settingRow, borderBottom: 'none' }} onClick={() => toggleSection('about')}>
            <span style={{ fontWeight: 'bold' }}>Acerca de Cada Amanecer</span>
            {openSection === 'about' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          {openSection === 'about' && (
            <div style={accordionContent}>
              Cada Amanecer nace como un espacio de pausa y reflexión en el ajetreo diario. Nuestra finalidad es conectar tu espíritu con la sabiduría milenaria de forma sencilla, brindándote una palabra de aliento y un momento de paz para comenzar tu jornada con propósito y esperanza renovada.
            </div>
          )}
        </div>

        {/* Comentarios */}
        <div style={{ borderBottom: '1px solid var(--divider)' }}>
          <button style={{ ...settingRow, borderBottom: 'none' }} onClick={() => toggleSection('comments')}>
            <span style={{ fontWeight: 'bold' }}>Comentarios</span>
            {openSection === 'comments' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          {openSection === 'comments' && (
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
          <button style={settingRow} onClick={() => setModalContent('terms')}>
            <span style={{ fontWeight: 'bold' }}>Términos y Condiciones</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Privacidad */}
        <div style={{ borderBottom: '1px solid var(--divider)' }}>
          <button style={settingRow} onClick={() => setModalContent('privacy')}>
            <span style={{ fontWeight: 'bold' }}>Política de Privacidad</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Acciones de Cuenta */}
        <button style={{ ...settingRow, color: 'var(--primary)', marginTop: '30px' }} onClick={() => navigate('/')}>
          <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogOut size={20} /> Salir
          </span>
        </button>

        <button style={{ ...settingRow, color: 'var(--text-gray)' }} onClick={() => setShowDeleteModal(true)}>
          <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trash2 size={20} /> Eliminar cuenta
          </span>
        </button>
      </div>

      {/* Modal de Políticas y Términos (Mismo formato que Bienvenida) */}
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
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{policyContent[modalContent].title}</h2>
              <button onClick={() => setModalContent(null)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ color: 'var(--primary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{policyContent[modalContent].text}</div>
            <button className="primary-button" style={{ marginTop: '20px', padding: '15px' }} onClick={() => setModalContent(null)}>Entendido</button>
          </div>
        </div>
      )}

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
