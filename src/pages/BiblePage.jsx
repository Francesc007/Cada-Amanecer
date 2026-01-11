import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronLeft, Search, BookOpen, Star, ChevronRight, Loader2 } from 'lucide-react';

// 1. Data Local: Lista completa de libros
const BIBLE_BOOKS = {
  OLD: [
    { id: 1, name: 'Génesis', chapters: 50, slug: 'genesis' },
    { id: 2, name: 'Éxodo', chapters: 40, slug: 'exodo' },
    { id: 3, name: 'Levítico', chapters: 27, slug: 'levitico' },
    { id: 4, name: 'Números', chapters: 36, slug: 'numeros' },
    { id: 5, name: 'Deuteronomio', chapters: 34, slug: 'deuteronomio' },
    { id: 6, name: 'Josué', chapters: 24, slug: 'josue' },
    { id: 7, name: 'Jueces', chapters: 21, slug: 'jueces' },
    { id: 8, name: 'Rut', chapters: 4, slug: 'rut' },
    { id: 9, name: '1 Samuel', chapters: 31, slug: '1-samuel' },
    { id: 10, name: '2 Samuel', chapters: 24, slug: '2-samuel' },
    { id: 11, name: '1 Reyes', chapters: 22, slug: '1-reyes' },
    { id: 12, name: '2 Reyes', chapters: 25, slug: '2-reyes' },
    { id: 13, name: '1 Crónicas', chapters: 29, slug: '1-cronicas' },
    { id: 14, name: '2 Crónicas', chapters: 36, slug: '2-cronicas' },
    { id: 15, name: 'Esdras', chapters: 10, slug: 'esdras' },
    { id: 16, name: 'Nehemías', chapters: 13, slug: 'nehemias' },
    { id: 17, name: 'Ester', chapters: 10, slug: 'ester' },
    { id: 18, name: 'Job', chapters: 42, slug: 'job' },
    { id: 19, name: 'Salmos', chapters: 150, slug: 'salmos' },
    { id: 20, name: 'Proverbios', chapters: 31, slug: 'proverbios' },
    { id: 21, name: 'Eclesiastés', chapters: 12, slug: 'eclesiastes' },
    { id: 22, name: 'Cantares', chapters: 8, slug: 'cantares' },
    { id: 23, name: 'Isaías', chapters: 66, slug: 'isaias' },
    { id: 24, name: 'Jeremías', chapters: 52, slug: 'jeremias' },
    { id: 25, name: 'Lamentaciones', chapters: 5, slug: 'lamentaciones' },
    { id: 26, name: 'Ezequiel', chapters: 48, slug: 'ezequiel' },
    { id: 27, name: 'Daniel', chapters: 12, slug: 'daniel' },
    { id: 28, name: 'Oseas', chapters: 14, slug: 'oseas' },
    { id: 29, name: 'Joel', chapters: 3, slug: 'joel' },
    { id: 30, name: 'Amós', chapters: 9, slug: 'amos' },
    { id: 31, name: 'Abdías', chapters: 1, slug: 'abdias' },
    { id: 32, name: 'Jonás', chapters: 4, slug: 'jonas' },
    { id: 33, name: 'Miqueas', chapters: 7, slug: 'miqueas' },
    { id: 34, name: 'Nahúm', chapters: 3, slug: 'nahum' },
    { id: 35, name: 'Habacuc', chapters: 3, slug: 'habacuc' },
    { id: 36, name: 'Sofonías', chapters: 3, slug: 'sofonias' },
    { id: 37, name: 'Hageo', chapters: 2, slug: 'hageo' },
    { id: 38, name: 'Zacarías', chapters: 14, slug: 'zacarias' },
    { id: 39, name: 'Malaquías', chapters: 4, slug: 'malaquias' }
  ],
  NEW: [
    { id: 40, name: 'Mateo', chapters: 28, slug: 'mateo' },
    { id: 41, name: 'Marcos', chapters: 16, slug: 'marcos' },
    { id: 42, name: 'Lucas', chapters: 24, slug: 'lucas' },
    { id: 43, name: 'Juan', chapters: 21, slug: 'juan' },
    { id: 44, name: 'Hechos', chapters: 28, slug: 'hechos' },
    { id: 45, name: 'Romanos', chapters: 16, slug: 'romanos' },
    { id: 46, name: '1 Corintios', chapters: 16, slug: '1-corintios' },
    { id: 47, name: '2 Corintios', chapters: 13, slug: '2-corintios' },
    { id: 48, name: 'Gálatas', chapters: 6, slug: 'galatas' },
    { id: 49, name: 'Efesios', chapters: 6, slug: 'efesios' },
    { id: 50, name: 'Filipenses', chapters: 4, slug: 'filipenses' },
    { id: 51, name: 'Colosenses', chapters: 4, slug: 'colosenses' },
    { id: 52, name: '1 Tesalonicenses', chapters: 5, slug: '1-tesalonicenses' },
    { id: 53, name: '2 Tesalonicenses', chapters: 3, slug: '2-tesalonicenses' },
    { id: 54, name: '1 Timoteo', chapters: 6, slug: '1-timoteo' },
    { id: 55, name: '2 Timoteo', chapters: 4, slug: '2-timoteo' },
    { id: 56, name: 'Tito', chapters: 3, slug: 'tito' },
    { id: 57, name: 'Filemón', chapters: 1, slug: 'filemon' },
    { id: 58, name: 'Hebreos', chapters: 13, slug: 'hebreos' },
    { id: 59, name: 'Santiago', chapters: 5, slug: 'santiago' },
    { id: 60, name: '1 Pedro', chapters: 5, slug: '1-pedro' },
    { id: 61, name: '2 Pedro', chapters: 3, slug: '2-pedro' },
    { id: 62, name: '1 Juan', chapters: 5, slug: '1-juan' },
    { id: 63, name: '2 Juan', chapters: 1, slug: '2-juan' },
    { id: 64, name: '3 Juan', chapters: 1, slug: '3-juan' },
    { id: 65, name: 'Judas', chapters: 1, slug: 'judas' },
    { id: 66, name: 'Apocalipsis', chapters: 22, slug: 'apocalipsis' }
  ]
};

// Helper para convertir a números romanos
const toRoman = (num) => {
  const map = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let result = '';
  for (let key in map) {
    while (num >= map[key]) {
      result += key;
      num -= map[key];
    }
  }
  return result;
};

const BiblePage = ({ isPremium }) => {
  const navigate = useNavigate();
  
  const [view, setView] = useState('testaments'); 
  const [testament, setTestament] = useState('OLD'); 
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedId, setHighlightedId] = useState(null);
  
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredBooks = BIBLE_BOOKS[testament].filter(book => 
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookSelect = (book) => {
    setHighlightedId(book.id);
    setTimeout(() => {
      setSelectedBook(book);
      setView('chapters');
      setHighlightedId(null);
    }, 200);
  };

  const handleChapterSelect = (chapterNum) => {
    setHighlightedId(chapterNum);
    setTimeout(() => {
      setSelectedChapter(chapterNum);
      setView('reader');
      setHighlightedId(null);
      fetchVerses(selectedBook.name, chapterNum);
    }, 200);
  };

  const fetchVerses = async (bookName, chapterNum) => {
    setLoading(true);
    setVerses([]);
    try {
      // Mapeo específico para libros con prefijo 'S.' (sin espacio) en la base de datos
      let libroParaConsultar = bookName;
      
      if (bookName === 'Mateo') libroParaConsultar = 'S.Mateo';
      if (bookName === 'Marcos') libroParaConsultar = 'S.Marcos';
      if (bookName === 'Lucas') libroParaConsultar = 'S.Lucas';
      if (bookName === 'Juan') libroParaConsultar = 'S.Juan';

      const { data, error } = await supabase
        .from('bible_verses')
        .select('verse_number, verse_text')
        .eq('book_name', libroParaConsultar)
        .eq('chapter', chapterNum)
        .order('verse_number', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setVerses(data);
      } else {
        throw new Error('No se encontraron versículos');
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
      // Fallback con mensaje claro
      setVerses([
        { verse_number: 1, verse_text: "Lo sentimos, este capítulo aún no está disponible en nuestra base de datos local." },
        { verse_number: 2, verse_text: "Estamos trabajando para completar toda la Biblia Reina Valera 1960." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (view === 'reader') setView('chapters');
    else if (view === 'chapters') setView('testaments');
    else navigate('/home');
  };

  return (
    <div style={{ backgroundColor: '#F7F4EB', minHeight: '100vh', padding: '20px', paddingBottom: '100px' }}>
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '25px',
        position: 'sticky',
        top: 0,
        backgroundColor: '#F7F4EB',
        padding: '10px 0',
        zIndex: 10
      }}>
        <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
          <ChevronLeft size={28} />
        </button>
        <div style={{ marginLeft: '15px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#1A2B48', margin: 0 }}>
            {view === 'testaments' && 'La Biblia'}
            {view === 'chapters' && selectedBook?.name}
            {view === 'reader' && `${selectedBook?.name} ${selectedChapter}`}
          </h1>
          {view === 'testaments' && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-gray)', margin: 0 }}>Selecciona un libro para comenzar</p>
          )}
        </div>
      </header>

      {view === 'testaments' && (
        <div className="animate-fade-in">
          <div style={{ 
            display: 'flex', 
            backgroundColor: 'var(--white)', 
            padding: '5px', 
            borderRadius: '12px', 
            marginBottom: '20px',
            border: '1px solid var(--divider)'
          }}>
            {['OLD', 'NEW'].map(t => (
              <button
                key={t}
                onClick={() => setTestament(t)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: testament === t ? 'var(--primary)' : 'transparent',
                  color: testament === t ? 'var(--background)' : 'var(--primary)',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >
                {t === 'OLD' ? 'ANTIGUO TESTAMENTO' : 'NUEVO TESTAMENTO'}
              </button>
            ))}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--white)', 
            borderRadius: '16px', 
            padding: '12px 15px', 
            marginBottom: '25px',
            border: '1px solid var(--divider)'
          }}>
            <Search size={20} color="var(--primary)" style={{ opacity: 0.4 }} />
            <input 
              type="text" 
              placeholder="Buscar libro..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'none', marginLeft: '10px', width: '100%', outline: 'none', color: 'var(--primary)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            {filteredBooks.map(book => (
              <div 
                key={book.id} 
                onClick={() => handleBookSelect(book)}
                className="animate-scale-in"
                style={{ 
                  backgroundColor: 'var(--white)', 
                  padding: '20px', 
                  borderRadius: '24px', 
                  border: highlightedId === book.id ? '2px solid var(--accent)' : '1px solid var(--divider)',
                  boxShadow: highlightedId === book.id ? '0 0 15px rgba(212, 175, 55, 0.3)' : 'var(--shadow)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  transition: '0.2s all ease'
                }}
              >
                <p style={{ color: '#1A2B48', fontWeight: 'bold', fontSize: '1rem', margin: 0 }}>{book.name}</p>
                <p style={{ color: 'var(--text-gray)', fontSize: '0.75rem', margin: 0 }}>{book.chapters} capítulos</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'chapters' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(num => (
            <div
              key={num}
              onClick={() => handleChapterSelect(num)}
              className="animate-scale-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                backgroundColor: 'var(--white)',
                borderRadius: '16px',
                border: highlightedId === num ? '2px solid var(--accent)' : '1px solid var(--divider)',
                boxShadow: highlightedId === num ? '0 0 15px rgba(212, 175, 55, 0.3)' : '0 2px 8px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: '0.2s all ease'
              }}
            >
              <div style={{ 
                width: '70px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid var(--divider)',
                marginRight: '15px',
                paddingRight: '5px'
              }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--accent)', fontWeight: 'bold', lineHeight: '1.2' }}>{toRoman(num)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>Capítulo {num}</p>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--accent)', opacity: 0.6 }} />
            </div>
          ))}
        </div>
      )}

      {view === 'reader' && (
        <div 
          className="animate-fade-in" 
          style={{ 
            backgroundColor: '#FDFCF9', 
            padding: '40px 25px', 
            borderRadius: '32px', 
            border: '1px solid var(--divider)', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            minHeight: '60vh'
          }}
        >
          {loading ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '60px 0',
              gap: '15px'
            }}>
              <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent)' }} />
              <p style={{ color: 'var(--text-gray)', fontSize: '0.9rem', fontStyle: 'italic' }}>Abriendo las Escrituras...</p>
            </div>
          ) : (
            <div style={{ 
              fontFamily: '"Georgia", "Times New Roman", serif', 
              fontSize: '18px', 
              lineHeight: '1.8', 
              color: '#2C3E50',
              textAlign: 'justify'
            }}>
              {verses.map(v => (
                <span key={v.verse_number} style={{ marginBottom: '15px', display: 'inline-block' }}>
                  <sup style={{ 
                    color: 'var(--accent)', 
                    fontWeight: 'bold', 
                    fontSize: '0.75rem', 
                    marginRight: '6px',
                    marginLeft: v.verse_number === 1 ? 0 : '10px'
                  }}>
                    {v.verse_number}
                  </sup>
                  {v.verse_text}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BiblePage;
