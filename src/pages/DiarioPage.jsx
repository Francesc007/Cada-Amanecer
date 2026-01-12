import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronLeft, BookOpen, Calendar, Trash2, Loader2, MessageSquare } from 'lucide-react';

const DiarioPage = () => {
  const navigate = useNavigate();
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    try {
      const deviceId = localStorage.getItem('cada_amanecer_device_id');
      const { data, error } = await supabase
        .from('user_reflections')
        .select('*')
        .eq('user_id', deviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReflections(data || []);
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReflection = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reflexión?')) return;

    try {
      const { error } = await supabase
        .from('user_reflections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReflections(reflections.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting reflection:', error);
      alert('No se pudo eliminar la reflexión.');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div style={{ backgroundColor: '#F7F4EB', minHeight: '100vh', padding: '20px', paddingBottom: '100px' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
          <ChevronLeft size={28} />
        </button>
        <div style={{ marginLeft: '15px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1A2B48', margin: 0 }}>Mi Diario</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', margin: 0 }}>Tus encuentros con Dios</p>
        </div>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent)' }} />
        </div>
      ) : reflections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-gray)' }}>
          <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
          <p>Aún no has guardado reflexiones.</p>
          <p style={{ fontSize: '0.9rem' }}>Comienza hoy en la Biblia o en la Guía Espiritual.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reflections.map((ref) => (
            <div 
              key={ref.id}
              className="animate-fade-in"
              style={{ 
                backgroundColor: 'var(--white)', 
                padding: '10px 20px', 
                borderRadius: '24px', 
                border: '1px solid var(--divider)',
                boxShadow: 'var(--shadow)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  <Calendar size={14} />
                  {formatDate(ref.created_at)}
                </div>
                <button 
                  onClick={() => deleteReflection(ref.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-gray)', cursor: 'pointer', opacity: 0.6 }}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {ref.reference && ref.reference !== 'Reflexión Diaria' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '12px', opacity: 0.8 }}>
                  <MessageSquare size={16} />
                  {ref.reference}
                </div>
              )}

              <p style={{ 
                color: 'var(--primary)', 
                fontSize: '1rem', 
                lineHeight: '1.6', 
                margin: 0,
                textAlign: 'justify',
                whiteSpace: 'pre-wrap'
              }}>
                {ref.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiarioPage;
