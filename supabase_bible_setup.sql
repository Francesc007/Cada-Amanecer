-- Crear la tabla bible_verses
CREATE TABLE IF NOT EXISTS bible_verses (
    id BIGSERIAL PRIMARY KEY,
    book_name TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    verse_text TEXT NOT NULL,
    version TEXT DEFAULT 'RVR1960',
    UNIQUE(book_name, chapter, verse_number, version)
);

-- Habilitar RLS
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (anon)
CREATE POLICY "Permitir lectura pública de versículos" 
ON bible_verses FOR SELECT 
USING (true);

-- Insertar datos de muestra: Génesis 1 (Versículos 1-5)
INSERT INTO bible_verses (book_name, chapter, verse_number, verse_text) VALUES
('Génesis', 1, 1, 'En el principio creó Dios los cielos y la tierra.'),
('Génesis', 1, 2, 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.'),
('Génesis', 1, 3, 'Y dijo Dios: Sea la luz; y fue la luz.'),
('Génesis', 1, 4, 'Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.'),
('Génesis', 1, 5, 'Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana un día.');

-- Insertar datos de muestra: Juan 1 (Versículos 1-5)
INSERT INTO bible_verses (book_name, chapter, verse_number, verse_text) VALUES
('Juan', 1, 1, 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.'),
('Juan', 1, 2, 'Este era en el principio con Dios.'),
('Juan', 1, 3, 'Todas las cosas por él fueron hechas, y sin él nada de lo que ha sido hecho, fue hecho.'),
('Juan', 1, 4, 'En él estaba la vida, y la vida era la luz de los hombres.'),
('Juan', 1, 5, 'La luz en las tinieblas resplandece, y las tinieblas no prevalecieron contra ella.');
