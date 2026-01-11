import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Credenciales de Supabase
const supabaseUrl = 'https://elhncujrcvotrjpncfdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaG5jdWpyY3ZvdHJqcG5jZmRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MzMwODcsImV4cCI6MjA4MzUwOTA4N30.HzSwr0GTaOYADNJsrQ1hkndJnAaqDx8gVvxZVR03sZY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importBiblia() {
    console.log('--- Iniciando Importación Masiva de la Biblia Reina Valera 1960 ---');
    
    try {
        // 1. Limpieza inicial
        console.log('Limpiando tabla bible_verses para una carga fresca...');
        const { error: deleteError } = await supabase
            .from('bible_verses')
            .delete()
            .neq('id', 0);
        
        if (deleteError) {
            console.warn('Aviso al limpiar la tabla:', deleteError.message);
        }

        // 2. Cargar y procesar el JSON
        const rawData = fs.readFileSync('./RVR1960 - Spanish.json', 'utf8');
        const bibleData = JSON.parse(rawData);
        
        const allVerses = [];
        const bookNames = Object.keys(bibleData).filter(key => key !== 'lang');
        
        console.log(`\nProcesando ${bookNames.length} libros...`);

        for (const bookName of bookNames) {
            const chapters = bibleData[bookName];
            for (const [chapterNum, verses] of Object.entries(chapters)) {
                for (const [verseNum, verseText] of Object.entries(verses)) {
                    allVerses.push({
                        book_name: bookName,
                        chapter: parseInt(chapterNum),
                        verse_number: parseInt(verseNum),
                        verse_text: verseText,
                        version: 'RVR1960'
                    });
                }
            }
        }

        const totalToInsert = allVerses.length;
        console.log(`Total de versículos a insertar: ${totalToInsert}`);
        console.log('--- Iniciando inserción masiva en bloques de 1,000 ---\n');

        let insertedCount = 0;
        let errorCount = 0;
        const batchSize = 1000;
        
        // 3. Inserción Masiva con manejo de errores por bloque
        for (let i = 0; i < allVerses.length; i += batchSize) {
            const batch = allVerses.slice(i, i + batchSize);
            const currentBook = batch[0].book_name;
            
            try {
                const { error } = await supabase
                    .from('bible_verses')
                    .insert(batch);

                if (error) {
                    console.error(`\n[ERROR] Fallo en el bloque ${i / batchSize + 1} (${currentBook}):`, error.message);
                    errorCount += batch.length;
                } else {
                    insertedCount += batch.length;
                    // Log de progreso
                    process.stdout.write(`Cargando Escrituras... [${insertedCount} / ${totalToInsert}] - Libro actual: ${currentBook}          \r`);
                }
            } catch (err) {
                console.error(`\n[ERROR CRÍTICO] Excepción en bloque ${i / batchSize + 1}:`, err.message);
                errorCount += batch.length;
                continue; // Continuar con el siguiente bloque aunque este falle
            }
        }

        console.log('\n\n--- RESUMEN DE IMPORTACIÓN ---');
        console.log(`✅ Versículos insertados con éxito: ${insertedCount}`);
        console.log(`❌ Versículos fallidos: ${errorCount}`);
        console.log(`Total procesado: ${insertedCount + errorCount}`);
        console.log('-------------------------------');
        
        if (insertedCount > 0) {
            console.log('¡La Biblia ya está disponible en tu base de datos!');
        } else {
            console.log('No se pudo insertar ningún versículo. Revisa la conexión y las políticas de Supabase.');
        }

    } catch (error) {
        console.error('\nError fatal durante la lectura del archivo o conexión:', error);
    }
}

importBiblia();
