-- ==========================================
-- MASTER SQL: ARREGLO DE POLÍTICAS SUPABASE
-- ==========================================

-- 1. LIMPIEZA DE POLÍTICAS ANTIGUAS (Para evitar el error "policy already exists")
DO $$ 
BEGIN
    -- Tabla user_reflections
    DROP POLICY IF EXISTS "Permitir acceso total a anon en reflexiones" ON user_reflections;
    DROP POLICY IF EXISTS "Usuarios pueden ver sus propias reflexiones" ON user_reflections;
    DROP POLICY IF EXISTS "Usuarios pueden insertar sus propias reflexiones" ON user_reflections;
    DROP POLICY IF EXISTS "Permitir todo a anon basado en device_id" ON user_reflections;
    DROP POLICY IF EXISTS "Allow anon to insert reflections" ON user_reflections;
    DROP POLICY IF EXISTS "Allow anon to view own reflections" ON user_reflections;
    DROP POLICY IF EXISTS "Allow anon to delete own reflections" ON user_reflections;

    -- Tabla profiles
    DROP POLICY IF EXISTS "Allow anon select on profiles" ON profiles;
    DROP POLICY IF EXISTS "Allow anon update on profiles" ON profiles;
    DROP POLICY IF EXISTS "Allow anon insert on profiles" ON profiles;
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

    -- Tabla daily_progress
    DROP POLICY IF EXISTS "Allow anon select on daily_progress" ON daily_progress;
    DROP POLICY IF EXISTS "Allow anon insert on daily_progress" ON daily_progress;
    DROP POLICY IF EXISTS "Allow anon update on daily_progress" ON daily_progress;
END $$;

-- 2. ASEGURAR QUE LAS TABLAS TENGAN RLS HABILITADO
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reflections ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS PARA 'profiles' (Crucial para que el device_id funcione)
CREATE POLICY "Acceso total anon profiles" ON profiles 
FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. POLÍTICAS PARA 'daily_progress' (Crucial para el streak y progreso)
CREATE POLICY "Acceso total anon progress" ON daily_progress 
FOR ALL TO anon USING (true) WITH CHECK (true);

-- 5. POLÍTICAS PARA 'user_reflections' (Tu diario personal)
-- Primero nos aseguramos de que la tabla tenga las columnas correctas
-- Si intentaste crearla con 'content' o 'reflection_text', aquí la unificamos
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_reflections' AND column_name='content') THEN
        ALTER TABLE user_reflections ADD COLUMN content TEXT;
    END IF;
END $$;

CREATE POLICY "Acceso total anon reflections" ON user_reflections 
FOR ALL TO anon USING (true) WITH CHECK (true);

-- 6. PERMISOS DE ROL (Garantizar que el rol anon puede usar las tablas)
GRANT ALL ON TABLE profiles TO anon;
GRANT ALL ON TABLE daily_progress TO anon;
GRANT ALL ON TABLE user_reflections TO anon;
GRANT ALL ON SEQUENCE user_reflections_id_seq TO anon; -- Muy importante para el ID auto-incremental

-- 7. NOTA FINAL:
-- Si usas device_id como UUID, asegúrate de que al insertar en el código
-- el valor sea un UUID válido. Si no, cambia el tipo de user_id a TEXT.
