#!/usr/bin/env node
/**
 * 📄 NOTION SIMPLE INTEGRATION - FORESTECH
 * Script simplificado para subir documentación a Notion
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

/**
 * 📊 Crear base de datos primero (funciona mejor que páginas directas)
 */
async function createDocumentationDatabase() {
    try {
        console.log('📊 Creando base de datos de documentación...');
        
        const database = await notion.databases.create({
            parent: { type: 'workspace' },
            title: [
                {
                    type: 'text',
                    text: {
                        content: 'Forestech - Documentación Técnica'
                    }
                }
            ],
            properties: {
                'Título': {
                    title: {}
                },
                'Tipo': {
                    select: {
                        options: [
                            { name: 'Análisis Técnico', color: 'blue' },
                            { name: 'Documentación', color: 'green' },
                            { name: 'Arquitectura', color: 'red' },
                            { name: 'Estado Proyecto', color: 'purple' }
                        ]
                    }
                },
                'Proyecto': {
                    select: {
                        options: [
                            { name: 'Combustibles', color: 'orange' },
                            { name: 'Alimentación', color: 'green' },
                            { name: 'General', color: 'blue' }
                        ]
                    }
                },
                'Fecha': {
                    date: {}
                },
                'Contenido': {
                    rich_text: {}
                }
            }
        });
        
        console.log('✅ Base de datos creada exitosamente!');
        console.log(`🔗 URL: ${database.url}`);
        console.log(`📝 ID: ${database.id}`);
        
        return database;
        
    } catch (error) {
        console.error('❌ Error creando base de datos:', error);
        throw error;
    }
}

/**
 * 📝 Agregar página a la base de datos
 */
async function addPageToDatabase(databaseId, title, content, tipo = 'Análisis Técnico', proyecto = 'Combustibles') {
    try {
        console.log(`📝 Agregando página: ${title}...`);
        
        // Truncar contenido si es muy largo para Notion
        const truncatedContent = content.length > 2000 ? 
            content.substring(0, 1900) + '\n\n... (Contenido truncado - Ver archivo completo)' : 
            content;
        
        const page = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                'Título': {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ]
                },
                'Tipo': {
                    select: {
                        name: tipo
                    }
                },
                'Proyecto': {
                    select: {
                        name: proyecto
                    }
                },
                'Fecha': {
                    date: {
                        start: new Date().toISOString().split('T')[0]
                    }
                },
                'Contenido': {
                    rich_text: [
                        {
                            text: {
                                content: truncatedContent
                            }
                        }
                    ]
                }
            }
        });
        
        console.log(`✅ Página agregada: ${page.url}`);
        return page;
        
    } catch (error) {
        console.error('❌ Error agregando página:', error);
        throw error;
    }
}

/**
 * 🔍 Buscar base de datos existente
 */
async function findExistingDatabase() {
    try {
        const databases = await notion.search({
            query: 'Forestech',
            filter: {
                property: 'object',
                value: 'database'
            }
        });
        
        if (databases.results.length > 0) {
            console.log('✅ Base de datos existente encontrada');
            return databases.results[0];
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Error buscando base de datos:', error);
        return null;
    }
}

/**
 * 🚀 Función principal
 */
async function main() {
    try {
        console.log('🚀 Iniciando integración simplificada con Notion...');
        console.log('==================================================');
        
        // Verificar token
        if (!process.env.NOTION_API_KEY) {
            throw new Error('❌ NOTION_API_KEY no configurado en .env');
        }
        
        console.log('✅ Token de Notion configurado');
        
        // Buscar o crear base de datos
        let database = await findExistingDatabase();
        
        if (!database) {
            console.log('📊 No se encontró base de datos. Creando nueva...');
            database = await createDocumentationDatabase();
        } else {
            console.log(`✅ Usando base de datos existente: ${database.id}`);
        }
        
        // Subir análisis de combustibles
        console.log('\n🔥 Subiendo análisis de combustibles...');
        
        const analysisPath = path.join(__dirname, '..', 'NOTION-Combustibles-Analisis.md');
        
        if (!fs.existsSync(analysisPath)) {
            throw new Error(`Archivo no encontrado: ${analysisPath}`);
        }
        
        const content = fs.readFileSync(analysisPath, 'utf8');
        
        await addPageToDatabase(
            database.id,
            '🔥 FORESTECH - ANÁLISIS ESTRUCTURA COMBUSTIBLES',
            content,
            'Análisis Técnico',
            'Combustibles'
        );
        
        // Subir CLAUDE.md también
        console.log('\n📚 Subiendo CLAUDE.md...');
        
        const claudePath = path.join(__dirname, '..', 'CLAUDE.md');
        if (fs.existsSync(claudePath)) {
            const claudeContent = fs.readFileSync(claudePath, 'utf8');
            
            await addPageToDatabase(
                database.id,
                '📚 CLAUDE.md - Guía de Desarrollo',
                claudeContent,
                'Documentación',
                'General'
            );
        }
        
        console.log('\n✅ Integración completada exitosamente!');
        console.log(`🔗 Accede a tu base de datos: ${database.url}`);
        
    } catch (error) {
        console.error('❌ Error en la integración:', error.message);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = {
    createDocumentationDatabase,
    addPageToDatabase,
    findExistingDatabase
};
