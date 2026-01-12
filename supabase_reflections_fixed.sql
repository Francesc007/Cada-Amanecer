-- 1. Eliminar la tabla y políticas previas para empezar de cero y evitar conflictos
DROP TABLE IF EXISTS user_reflections;

-- 2. Crear la tabla user_reflections con tipos exactos
CREATE TABLE user_reflections (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL, -- Debe coincidir con el tipo de ID en la tabla profiles
    content TEXT NOT NULL,
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;

-- 4. Crear una ÚNICA política simple para el rol anon (ya que usamos device_id como UUID)
-- Esta política permite a cualquier usuario anónimo insertar y leer datos.
-- En una app con login real usaríamos auth.uid(), pero aquí el filtro se hace por user_id en la consulta.
CREATE POLICY "Permitir acceso total a anon en reflexiones" 
ON user_reflections 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- 5. Verificar que la tabla profiles permita también este acceso (por si acaso)
-- (Asumiendo que ya tienes la tabla profiles configurada para anon)
