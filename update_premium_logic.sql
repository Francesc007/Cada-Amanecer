-- Agregar columnas para la gestión de suscripción
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan TEXT; -- 'monthly', 'yearly', 'none'
