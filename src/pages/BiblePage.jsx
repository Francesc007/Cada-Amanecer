import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronLeft, Search, X, ChevronRight, BookOpen } from 'lucide-react';
import { Navbar } from '../components/Navigation';

const BiblePage = ({ isPremium }) => {
  const navigate = useNavigate();
  const [testament, setTestament] = useState('OLD'); // 'OLD' or 'NEW'
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for Bible structure (Real implementation would fetch from Supabase)
  const bibleStructure = {
    OLD: [
      { id: 'gen', name: 'Génesis', chapters: 50 },
      { id: 'exo', name: 'Éxodo', chapters: 40 },
      { id: 'lev', name: 'Levítico', chapters: 27 },
      { id: 'num', name: 'Números', chapters: 36 },
      { id: 'deu', name: 'Deuteronomio', chapters: 34 },
      // ... more books
    ],
    NEW: [
      { id: 'mat', name: 'Mateo', chapters: 28 },
      { id: 'mar', name: 'Marcos', chapters: 16 },
      { id: 'luc', name: 'Lucas', chapters: 24 },
      { id: 'jua', name: 'Juan', chapters: 21 },
      { id: 'hec', name: 'Hechos', chapters: 28 },
      // ... more books
    ]
  };

  const filteredBooks = bibleStructure[testament].filter(book => 
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
  };

  const handleChapterClick = (chapterNum) => {
    setSelectedChapter(chapterNum);
    // Simular carga de contenido
    setLoading(true);
    setTimeout(() => {
      setChapterContent([
        { verse: 1, text: "En el principio creó Dios los cielos y la tierra." },
        { verse: 2, text: "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas." },
        { verse: 3, text: "Y dijo Dios: Sea la luz; y fue la luz." }
      ]);
      setLoading(false);
    }, 500);
  };

  const resetView = () => {
    if (selectedChapter) {
      setSelectedChapter(null);
    } else if (selectedBook) {
      setSelectedBook(null);
    } else {
      navigate('/home');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', padding: '20px 20px 90px', position: 'relative' }}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={resetView} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
          <ChevronLeft size={28} />
        </button>
        <h1 style={{ marginLeft: '15px', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
          {selectedBook ? (selectedChapter ? `${selectedBook.name} ${selectedChapter}` : selectedBook.name) : 'La Biblia'}
        </h1>
      </header>

      {!selectedBook && (
        <>
          {/* Pestañas de Testamentos */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {['OLD', 'NEW'].map(t => (
              <button
                key={t}
                onClick={() => setTestament(t)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: testament === t ? 'var(--accent)' : 'var(--divider)',
                  color: testament === t ? 'white' : 'var(--primary)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                {t === 'OLD' ? 'ANTIGUO TESTAMENTO' : 'NUEVO TESTAMENTO'}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--white)', 
            borderRadius: '16px', 
            padding: '12px 15px', 
            marginBottom: '20px',
            border: '1px solid var(--divider)',
            boxShadow: 'var(--shadow)'
          }}>
            <Search size={20} color="var(--primary)" style={{ opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Buscar libro..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                border: 'none', 
                background: 'none', 
                marginLeft: '10px', 
                width: '100%', 
                outline: 'none',
                color: 'var(--primary)',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Cuadrícula de Libros */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
            {filteredBooks.map(book => (
              <div 
                key={book.id} 
                onClick={() => handleBookClick(book)}
                style={{ 
                  backgroundColor: 'var(--white)', 
                  padding: '20px', 
                  borderRadius: '20px', 
                  border: '1px solid var(--divider)',
                  boxShadow: 'var(--shadow)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{book.name}</p>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem' }}>{book.chapters} capítulos</p>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedBook && !selectedChapter && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleChapterClick(num)}
              style={{
                aspectRatio: '1',
                borderRadius: '12px',
                border: '1px solid var(--divider)',
                backgroundColor: 'var(--white)',
                color: 'var(--primary)',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {selectedChapter && (
        <div style={{ 
          backgroundColor: 'var(--background)', 
          padding: '20px', 
          borderRadius: '24px',
          lineHeight: '1.8'
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', opacity: 0.6 }}>Cargando...</p>
          ) : (
            chapterContent.map(v => (
              <p key={v.verse} style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.1rem', textAlign: 'justify' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold', marginRight: '8px', fontSize: '0.8rem', verticalAlign: 'super' }}>{v.verse}</span>
                {v.text}
              </p>
            ))
          )}
        </div>
      )}
      <Navbar activeTab="bible" isPremium={isPremium} />
    </div>
  );
};

export default BiblePage;
