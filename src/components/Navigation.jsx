import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, BookOpen, Search, Sparkles, Crown, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

// --- COMPONENTE: PREMIUM BADGE ---
export const PremiumBadge = ({ size = 10 }) => (
  <div style={{ 
    position: 'absolute', 
    top: '-4px', 
    right: '-8px', 
    backgroundColor: 'var(--accent)', 
    borderRadius: '50%', 
    width: '14px',
    height: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    border: '1.5px solid var(--background)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <Crown size={size} color="white" fill="white" />
  </div>
);

// --- COMPONENTE: SUBSCRIPTION MODAL ---
export const SubscriptionModal = ({ onClose, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  
  const handleAction = () => {
    onUpgrade(selectedPlan);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
        backgroundColor: 'var(--background)', 
        borderRadius: '32px', 
        width: '90%', 
        maxWidth: '380px',
        textAlign: 'center', 
        border: '1px solid var(--divider)',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ position: 'relative', height: '140px', width: '100%' }}>
          <img 
            src="/biblia.jpg" 
            alt="Acceso Total" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--background))' }}></div>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <Crown size={32} color="var(--accent)" fill="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '10px' }}>Función Exclusiva</h2>
          <p style={{ color: 'var(--primary)', opacity: 0.8, fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.4' }}>
            Prueba todas nuestras funciones premium gratis durante 7 días.
          </p>
          
          <button 
            className="primary-button" 
            style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', width: '100%', padding: '14px' }} 
            onClick={handleAction}
          >
            Ver planes de suscripción
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: NAVBAR INFERIOR ---
export const Navbar = ({ isPremium, setIsPremium }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  
  const tabs = [
    { id: 'home', label: 'Hoy', icon: Sun, path: '/home' },
    { id: 'bible', label: 'Biblia', icon: BookOpen, path: '/bible' },
    { id: 'explore', label: 'Explora', icon: Search, path: '/explore', premium: true },
    { id: 'guide', label: 'Guía', icon: Sparkles, path: '/guide', premium: true },
  ];

  const handleTabClick = (tab) => {
    if (tab.premium && !isPremium) {
      setPendingTab(tab.path);
      setShowPaywall(true);
      return;
    }
    navigate(tab.path);
  };

  // No mostrar el navbar en la bienvenida u onboarding
  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return null;
  }

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
        backgroundColor: 'var(--background)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid var(--divider)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="navbar-tab"
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
                <Icon size={24} color={isActive ? "var(--accent)" : "var(--primary)"} />
                {tab.premium && !isPremium && <PremiumBadge />}
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                color: isActive ? "var(--accent)" : "var(--primary)",
                fontWeight: isActive ? 'bold' : 'normal'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      {showPaywall && (
        <SubscriptionModal 
          onClose={() => setShowPaywall(false)} 
          onUpgrade={() => {
            setShowPaywall(false);
            navigate('/profile', { state: { openPremium: true } });
          }} 
        />
      )}
    </>
  );
};
