import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Compass, Play, BookOpen, Clock, Star, Crown } from 'lucide-react';
import { Navbar, PremiumBadge } from '../components/Navigation';

const ExplorePage = ({ isPremium }) => {
  const navigate = useNavigate();

  const categories = [
    { title: 'Meditaciones', icon: <Clock size={20} />, count: '12 audios', color: '#4A90E2' },
    { title: 'Planes de Lectura', icon: <BookOpen size={20} />, count: '5 planes', color: '#D4AF37' },
    { title: 'Momentos de Paz', icon: <Star size={20} />, count: '8 temas', color: '#7ED321' },
  ];

  const featured = [
    { title: 'Encuentra la Calma', desc: 'Meditación guiada para iniciar el día con paz.', duration: '5 min' },
    { title: 'Fortaleza en la Prueba', desc: 'Plan de 7 días para momentos difíciles.', duration: '7 días' },
  ];

  return (
    <div className="app-container" style={{ backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--divider)' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
          <ChevronLeft size={28} />
        </button>
        <h1 style={{ marginLeft: '15px', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Explora</h1>
      </header>

      <main style={{ flex: 1, padding: '20px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {/* Categorías */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          {categories.map((cat, i) => (
            <div 
              key={i} 
              style={{ 
                backgroundColor: 'var(--white)', 
                padding: '20px', 
                borderRadius: '24px', 
                border: '1px solid var(--divider)',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                backgroundColor: `${cat.color}20`, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: cat.color
              }}>
                {cat.icon}
              </div>
              <div>
                <p style={{ fontWeight: 'bold', color: 'var(--primary)', margin: 0, fontSize: '0.95rem' }}>{cat.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-gray)', margin: 0 }}>{cat.count}</p>
              </div>
              <PremiumBadge />
            </div>
          ))}
        </div>

        {/* Destacados */}
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass size={20} color="var(--accent)" /> Recomendados para ti
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {featured.map((item, i) => (
              <div 
                key={i}
                style={{ 
                  backgroundColor: 'var(--white)', 
                  padding: '20px', 
                  borderRadius: '24px', 
                  border: '1px solid var(--divider)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>{item.title}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-gray)', margin: 0 }}>{item.desc}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', marginTop: '8px', display: 'inline-block' }}>{item.duration}</span>
                </div>
                <button style={{ 
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary)', 
                  border: 'none', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  color: 'var(--accent)' 
                }}>
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
