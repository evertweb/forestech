#!/usr/bin/env node
/**
 * 📄 NOTION INTEGRATION - FORESTECH
 * Script para automatizar la subida de documentación a Notion
 * 
 * Autor: Sistema Forestech
 * Fecha: 14 de Julio de 2025
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

// IDs de bases de datos y páginas (debes configurar estos)
const CONFIG = {
    // Estas IDs las obtienes de Notion después de crear las bases de datos
    DATABASE_DOCS_ID: null,        // Base de datos de documentación
    DATABASE_PROJECTS_ID: null,    // Base de datos de proyectos
    PAGE_FORESTECH_ID: null,       // Página principal de Forestech
};

/**
 * � Función para obtener parent del workspace
 */
async function getWorkspaceParent() {
    try {
        // Primero intentar encontrar una página existente
        const pages = await notion.search({
            query: '',
            filter: {
                property: 'object',
                value: 'page'
            },
            page_size: 1
        });
        
        if (pages.results.length > 0) {
            console.log('📄 Usando página existente como parent');
            return { page_id: pages.results[0].id };
        }
        
        // Si no hay páginas, crear una base de datos como alternativa
        console.log('📊 Creando base de datos como contenedor...');
        const database = await notion.databases.create({
            parent: { type: 'workspace' },
            title: [
                {
                    type: 'text',
                    text: {
                        content: 'Forestech - Documentación'
                    }
                }
            ],
            properties: {
                'Título': {
                    title: {}
                },
                'Fecha': {
                    date: {}
                }
            }
        });
        
        return { database_id: database.id };
        
    } catch (error) {
        console.error('❌ Error obteniendo workspace parent:', error);
        // Como último recurso, intentar con workspace directo
        return { type: 'workspace' };
    }
}

/**
 * 🔍 Función para descubrir bases de datos disponibles
 */
async function discoverNotionWorkspace() {
    try {
        console.log('🔍 Descubriendo workspace de Notion...');
        
        // Buscar bases de datos
        const databases = await notion.search({
            query: '',
            filter: {
                property: 'object',
                value: 'database'
            }
        });
        
        console.log('📊 Bases de datos encontradas:');
        databases.results.forEach((db, index) => {
            console.log(`${index + 1}. ${db.title?.[0]?.plain_text || 'Sin título'} (${db.id})`);
        });
        
        // Buscar páginas
        const pages = await notion.search({
            query: 'Forestech',
            filter: {
                property: 'object',
                value: 'page'
            }
        });
        
        console.log('\n📄 Páginas encontradas:');
        pages.results.forEach((page, index) => {
            console.log(`${index + 1}. ${page.properties?.title?.title?.[0]?.plain_text || 'Sin título'} (${page.id})`);
        });
        
        return { databases: databases.results, pages: pages.results };
        
    } catch (error) {
        console.error('❌ Error descubriendo workspace:', error);
        throw error;
    }
}

/**
 * 📝 Función para crear una nueva página en Notion
 */
async function createNotionPage(title, content, parentId = null) {
    try {
        console.log(`📝 Creando página: ${title}...`);
        
        // Convertir markdown a bloques de Notion
        const blocks = convertMarkdownToNotionBlocks(content);
        
        const pageData = {
            parent: parentId ? { page_id: parentId } : await getWorkspaceParent(),
            properties: {
                title: {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ]
                }
            },
            children: blocks.slice(0, 100) // Notion limita a 100 bloques por request
        };
        
        const response = await notion.pages.create(pageData);
        
        // Si hay más bloques, añadirlos en requests adicionales
        if (blocks.length > 100) {
            for (let i = 100; i < blocks.length; i += 100) {
                const chunk = blocks.slice(i, i + 100);
                await notion.blocks.children.append({
                    block_id: response.id,
                    children: chunk
                });
            }
        }
        
        console.log(`✅ Página creada: ${response.url}`);
        return response;
        
    } catch (error) {
        console.error('❌ Error creando página:', error);
        throw error;
    }
}

/**
 * 🔄 Convertir markdown a bloques de Notion
 */
function convertMarkdownToNotionBlocks(markdown) {
    const lines = markdown.split('\n');
    const blocks = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim() === '') {
            continue;
        }
        
        // Títulos
        if (line.startsWith('# ')) {
            blocks.push({
                object: 'block',
                type: 'heading_1',
                heading_1: {
                    rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
                }
            });
        } else if (line.startsWith('## ')) {
            blocks.push({
                object: 'block',
                type: 'heading_2',
                heading_2: {
                    rich_text: [{ type: 'text', text: { content: line.substring(3) } }]
                }
            });
        } else if (line.startsWith('### ')) {
            blocks.push({
                object: 'block',
                type: 'heading_3',
                heading_3: {
                    rich_text: [{ type: 'text', text: { content: line.substring(4) } }]
                }
            });
        }
        // Listas
        else if (line.startsWith('- ')) {
            blocks.push({
                object: 'block',
                type: 'bulleted_list_item',
                bulleted_list_item: {
                    rich_text: [{ type: 'text', text: { content: line.substring(2) } }]
                }
            });
        }
        // Bloques de código
        else if (line.startsWith('```')) {
            const language = line.substring(3);
            const codeLines = [];
            i++; // Saltar la línea de apertura
            
            while (i < lines.length && !lines[i].startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            
            blocks.push({
                object: 'block',
                type: 'code',
                code: {
                    language: language || 'plain text',
                    rich_text: [{ type: 'text', text: { content: codeLines.join('\n') } }]
                }
            });
        }
        // Texto normal
        else {
            blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [{ type: 'text', text: { content: line } }]
                }
            });
        }
    }
    
    return blocks;
}

/**
 * 📊 Función para subir el análisis de combustibles
 */
async function uploadCombustiblesAnalysis() {
    try {
        console.log('🔥 Subiendo análisis de combustibles a Notion...');
        
        // Leer el archivo de análisis
        const analysisPath = path.join(__dirname, '..', 'NOTION-Combustibles-Analisis.md');
        
        if (!fs.existsSync(analysisPath)) {
            throw new Error(`Archivo no encontrado: ${analysisPath}`);
        }
        
        const content = fs.readFileSync(analysisPath, 'utf8');
        
        // Crear la página en Notion
        const page = await createNotionPage(
            '🔥 FORESTECH - ANÁLISIS ESTRUCTURA COMBUSTIBLES',
            content
        );
        
        console.log('✅ Análisis subido exitosamente a Notion!');
        console.log(`🔗 URL: ${page.url}`);
        
        return page;
        
    } catch (error) {
        console.error('❌ Error subiendo análisis:', error);
        throw error;
    }
}

/**
 * 🏗️ Función para crear estructura de base de datos para documentación
 */
async function createDocumentationDatabase() {
    try {
        console.log('🏗️ Creando base de datos de documentación...');
        
        const database = await notion.databases.create({
            parent: { type: 'workspace' },
            title: [
                {
                    type: 'text',
                    text: {
                        content: 'Forestech - Documentación'
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
                            { name: 'Tutorial', color: 'yellow' },
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
                            { name: 'Shared', color: 'gray' },
                            { name: 'General', color: 'blue' }
                        ]
                    }
                },
                'Estado': {
                    select: {
                        options: [
                            { name: 'Completado', color: 'green' },
                            { name: 'En Progreso', color: 'yellow' },
                            { name: 'Pendiente', color: 'red' }
                        ]
                    }
                },
                'Fecha': {
                    date: {}
                },
                'Prioridad': {
                    select: {
                        options: [
                            { name: 'Alta', color: 'red' },
                            { name: 'Media', color: 'yellow' },
                            { name: 'Baja', color: 'gray' }
                        ]
                    }
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
 * 🚀 Función principal
 */
async function main() {
    try {
        console.log('🚀 Iniciando integración con Notion...');
        console.log('==================================================');
        
        // Verificar token
        if (!process.env.NOTION_API_KEY) {
            throw new Error('❌ NOTION_API_KEY no configurado en .env');
        }
        
        console.log('✅ Token de Notion configurado');
        
        // Descubrir workspace
        const { databases, pages } = await discoverNotionWorkspace();
        
        console.log('\n==================================================');
        console.log('🎯 OPCIONES DISPONIBLES:');
        console.log('1. Subir análisis de combustibles');
        console.log('2. Crear base de datos de documentación');
        console.log('3. Mostrar información del workspace');
        console.log('==================================================');
        
        // Por ahora, ejecutar automáticamente la subida del análisis
        await uploadCombustiblesAnalysis();
        
        // Opcionalmente crear base de datos
        console.log('\n¿Quieres crear una base de datos para documentación? (ejecuta con --create-db)');
        
        if (process.argv.includes('--create-db')) {
            await createDocumentationDatabase();
        }
        
        console.log('\n✅ Integración con Notion completada!');
        
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
    createNotionPage,
    uploadCombustiblesAnalysis,
    createDocumentationDatabase,
    discoverNotionWorkspace
};
