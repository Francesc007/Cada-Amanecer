import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus credenciales de Supabase
const supabaseUrl = 'https://elhncujrcvotrjpncfdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaG5jdWpyY3ZvdHJqcG5jZmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MzMwODcsImV4cCI6MjA4MzUwOTA4N30.HzSwr0GTaOYADNJsrQ1hkndJnAaqDx8gVvxZVR03sZY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Instrucciones para la base de datos:
 * 
 * 1. Tabla 'profiles':
 *    - id: uuid (primary key, references auth.users)
 *    - goals: text[] (Paz, Guía, Fortaleza, Gratitud)
 *    - prayer_time: text (Mañana, Tarde, Noche)
 *    - faith_status: text[] (Opciones de fe)
 *    - is_premium: boolean (default: false)
 *    - streak_days: int (default: 0)
 *    - last_activity_date: date
 * 
 * 2. Tabla 'daily_content':
 *    - id: uuid
 *    - date: date (unique)
 *    - verse_title: text (Ej: Salmo 23:1)
 *    - verse_text: text
 *    - reflection: text
 *    - audio_url: text
 */
