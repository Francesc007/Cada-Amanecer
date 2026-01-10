import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, Compass, Sparkles, Crown } from 'lucide-react';

// --- COMPONENTE: PREMIUM BADGE ---
export const PremiumBadge = ({ size = 12 }) => (
  <div style={{ 
    position: 'absolute', 
    top: '-5px', 
    right: '-5px', 
    backgroundColor: 'white', 
    borderRadius: '50%', 
    padding: '2px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  }}>
    <Crown size={size} color="#D4AF37" fill="#D4AF37" />
  </div>
);

// --- COMPONENTE: SUBSCRIPTION MODAL ---
export const SubscriptionModal = ({ onClose, onUpgrade }) => (
  <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#FDFCF0', borderRadius: '30px 30px 0 0', padding: '40px 30px', textAlign: 'center' }}>
      <Crown size={48} color="#D4AF37" style={{ marginBottom: '20px' }} />
      <span style={{ backgroundColor: '#D4AF37', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>PREMIUM</span>
      <h2 className="modal-title" style={{ marginTop: '20px', color: '#1A2B48', fontWeight: 'bold' }}>Accede a funciones exclusivas</h2>
      <p className="modal-desc" style={{ color: '#1A2B48', opacity: 0.8, lineHeight: '1.6' }}>Desbloquea la IA Espiritual, meditaciones guiadas y planes de lectura personalizados.</p>
      <button className="primary-button" style={{ backgroundColor: '#D4AF37', color: 'white', marginTop: '20px', border: 'none' }} onClick={onUpgrade}>Activar Prueba Gratuita</button>
      <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#1A2B48', opacity: 0.5, cursor: 'pointer' }} onClick={onClose}>Volver por ahora</p>
    </div>
  </div>
);

// --- COMPONENTE: NAVBAR INFERIOR ---
export const Navbar = ({ activeTab, isPremium }) => {
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const tabs = [
    { id: 'home', label: 'Hoy', icon: Home, path: '/home' },
    { id: 'bible', label: 'Biblia', icon: BookOpen, path: '/bible' },
    { id: 'explore', label: 'Explora', icon: Compass, path: '/explore' },
    { id: 'guide', label: 'Guía', icon: Sparkles, path: '/guide', premium: true },
  ];

  const handleTabClick = (tab) => {
    if (tab.premium && !isPremium) {
      setShowPaywall(true);
      return;
    }
    navigate(tab.path);
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        height: '70px',
        backgroundColor: '#FDFCF0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                position: 'relative',
                minWidth: '60px'
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={24} color={isActive ? "#D4AF37" : "#1A2B48"} />
                {tab.premium && <PremiumBadge />}
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                color: isActive ? "#D4AF37" : "#1A2B48",
                fontWeight: isActive ? 'bold' : 'normal'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      {showPaywall && <SubscriptionModal onClose={() => setShowPaywall(false)} onUpgrade={() => { /* Lógica de upgrade */ }} />}
    </>
  );
};
