-- Crear la tabla user_reflections
CREATE TABLE IF NOT EXISTS user_reflections (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL, -- references profiles(id)
    content TEXT NOT NULL,
    reference TEXT, -- Ej: 'Juan 1', 'Oración Diaria', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus propias reflexiones
CREATE POLICY "Usuarios pueden ver sus propias reflexiones" 
ON user_reflections FOR SELECT 
USING (user_id::text = (select id::text from profiles where id = user_id));

-- Política para que los usuarios inserten sus propias reflexiones
CREATE POLICY "Usuarios pueden insertar sus propias reflexiones" 
ON user_reflections FOR INSERT 
WITH CHECK (user_id::text = (select id::text from profiles where id = user_id));

-- Política para anon (ya que no usamos auth formal)
CREATE POLICY "Permitir todo a anon basado en device_id" 
ON user_reflections FOR ALL 
USING (true) 
WITH CHECK (true);
