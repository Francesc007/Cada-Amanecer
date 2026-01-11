-- Script de carga inicial (Seed) para la tabla bible_verses
-- Asegúrate de haber ejecutado primero el script de creación de tabla (supabase_bible_setup.sql)

-- Limpiamos datos previos de estos capítulos para evitar duplicados si se vuelve a ejecutar
DELETE FROM bible_verses WHERE (book_name = 'Génesis' AND chapter = 1) OR (book_name = 'Juan' AND chapter = 1);

-- Insertar Génesis 1:1-5
INSERT INTO bible_verses (book_name, chapter, verse_number, verse_text, version) VALUES
('Génesis', 1, 1, 'En el principio creó Dios los cielos y la tierra.', 'RVR1960'),
('Génesis', 1, 2, 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.', 'RVR1960'),
('Génesis', 1, 3, 'Y dijo Dios: Sea la luz; y fue la luz.', 'RVR1960'),
('Génesis', 1, 4, 'Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.', 'RVR1960'),
('Génesis', 1, 5, 'Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana un día.', 'RVR1960');

-- Insertar Juan 1:1-5
INSERT INTO bible_verses (book_name, chapter, verse_number, verse_text, version) VALUES
('Juan', 1, 1, 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.', 'RVR1960'),
('Juan', 1, 2, 'Este era en el principio con Dios.', 'RVR1960'),
('Juan', 1, 3, 'Todas las cosas por él fueron hechas, y sin él nada de lo que ha sido hecho, fue hecho.', 'RVR1960'),
('Juan', 1, 4, 'En él estaba la vida, y la vida era la luz de los hombres.', 'RVR1960'),
('Juan', 1, 5, 'La luz en las tinieblas resplandece, y las tinieblas no prevalecieron contra ella.', 'RVR1960');
