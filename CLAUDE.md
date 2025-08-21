# CLAUDE.md

Este archivo proporciona orientación a **Claude en todos los entornos** (Claude Code, GitHub Copilot con Sonnet 4, y otros agentes) cuando trabaja con código en este repositorio.

## 🤖 **COMPATIBILIDAD MULTI-AGENTE - SONNET 4 OPTIMIZADO**

### 🎯 **ENTORNOS CLAUDE**

**🖥️ Claude Code** (claude.ai/code):

- **Contexto completo**: Este archivo + exploración activa de archivos
- **Fortalezas**: Análisis profundo, debugging interactivo, desarrollo full-stack
- **Comportamiento**: Usar herramientas paralelas, TodoWrite, agentes especializados

**🧩 GitHub Copilot + Sonnet 4** (VS Code/IDE):

- **Contexto limitado**: Este archivo + ventana actual del editor
- **Fortalezas**: Code completion, sugerencias inline, quick fixes
- **Comportamiento**: Patrones de código, convenciones, naming consistency

**🔧 Claude API/Agents** (CI/CD/Automation):

- **Contexto específico**: Este archivo + datos de entrada específicos
- **Fortalezas**: Code review, documentación automática, testing
- **Comportamiento**: Validaciones, generación de tests, análisis de calidad

### ⚡ **PROMPTING STRATEGIES POR ENTORNO**

**Claude Code - Prompts Extensos:**

```
"Analiza la app combustibles, identifica problemas de rendimiento en
MovementWizard.jsx:150-200, implementa optimizaciones usando React.memo
y useMemo, ejecuta tests, y documenta cambios en commit"
```

**GitHub Copilot - Prompts Cortos:**

```
// Crear función para validar combustible con density check
// Implementar useCallback para evitar re-renders
// Agregar error boundary para componente
```

**Claude API - Prompts Estructurados:**

```json
{
  "task": "code_review",
  "files": ["MovementWizard.jsx"],
  "focus": ["performance", "security", "accessibility"],
  "output": "markdown_report"
}
```

### 🧠 **PATRONES DE CONSISTENCIA CROSS-ENVIRONMENT**

**🔄 Naming Conventions:**

- Variables: `camelCase` (userProfile, movementData)
- Componentes: `PascalCase` (MovementWizard, AuthProvider)
- Archivos: `kebab-case` para utils, `PascalCase` para componentes
- Constants: `SCREAMING_SNAKE_CASE` (WEBHOOK_CONFIG, COLLECTIONS)

**📦 Code Patterns:**

```javascript
// ✅ Patrón consistente - todos los agentes lo reconocen
const useServiceHook = () => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const executeAction = useCallback(async (params) => {
    setLoading(true);
    try {
      const result = await service.action(params);
      setState(result);
      return result;
    } catch (error) {
      console.error('Error in useServiceHook:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, loading, executeAction };
};
```

**🔒 Security Patterns:**

```javascript
// ✅ Patrón seguro - reconocido por todos los agentes
const validateUserPermissions = (user, action) => {
  if (!user?.combustiblesPermissions) return false;
  return user.combustiblesPermissions[action] === true;
};
```

### 🎨 **CONTEXT MANAGEMENT STRATEGIES**

**📁 Estructura de Referencias:**

```
// En cualquier entorno, referenciar así:
// MovementWizard.jsx:150 (línea específica)
// @see docs/project/STRUCTURE.md (documentación)
// @implements webhookService.sendMovementNotification
// @requires Firebase Auth, Firestore Rules
```

**🔗 Context Linking:**

- **Short Context** (Copilot): `// @ref WEBHOOK_CONFIG en webhookService.js`
- **Medium Context** (API): `Related to movement notifications system`
- **Full Context** (Claude Code): Análisis completo de dependencias

### 🚀 **ENVIRONMENT-SPECIFIC OPTIMIZATIONS**

**🖥️ Claude Code Optimizations:**

- Usar múltiples herramientas en paralelo SIEMPRE
- TodoWrite para tracking completo
- Agentes especializados para dominio específico
- Análisis arquitectural profundo antes de implementar

**🧩 Copilot Optimizations:**

- Comentarios descriptivos para context triggers
- Consistent indentation (2 spaces React, 4 spaces otros)
- TypeScript interfaces cuando sea posible
- Error handling patterns estándar

**🔧 API/Automation Optimizations:**

- Structured outputs (JSON, Markdown)
- Atomic operations con rollback
- Comprehensive logging patterns
- Performance metrics collection

### 📊 **MEMORY PATTERN CONSISTENCY**

**🧠 Shared Knowledge Base:**

- Soluciones exitosas → Documentation automática
- Bug fixes → Prevention patterns
- Architecture decisions → Design rationale
- Performance optimizations → Benchmark data

**🔄 Cross-Environment Learning:**

```yaml
pattern_id: 'firebase_progress_wrapper'
environments: ['claude_code', 'copilot', 'api']
description: 'Execute Firebase operations with user feedback'
code_template: |
  await executeWithProgress('operationType', 'description', async () => {
    return await firebaseOperation();
  });
success_metrics: ['user_feedback', 'error_reduction', 'performance']
```

**IMPORTANTE:** Todos los agentes Claude deben seguir las mismas convenciones y usar el mismo contexto del proyecto para garantizar coherencia.

## ⚡ **EJECUTAR HERRAMIENTAS EN PARALELO - CRÍTICO**

**Claude DEBE usar múltiples herramientas en paralelo cuando sea posible:**

```
✅ CORRECTO - Llamadas paralelas:
Read + Grep + LS simultáneamente
Bash múltiples comandos en paralelo
Analizar varios archivos a la vez

❌ INCORRECTO - Secuencial innecesario:
Read → esperar → Grep → esperar → LS
Un comando por vez cuando podrían ser paralelos
```

**EJEMPLOS DE EJECUCIÓN PARALELA:**

- **Análisis de código**: Read múltiples archivos + Grep patrones + LS estructura
- **Git operations**: git status + git diff + git log en paralelo
- **Build verification**: lint + test + build checks simultáneos
- **Firebase queries**: Múltiples colecciones + usuarios + reglas a la vez

## 🤖 **MCPs CONFIGURADOS AUTOMÁTICAMENTE**

**Prioridad:** serena > context7 > github-cli > github > memory > filesystem > firebase

1. **🧠 serena**: Análisis semántico de código y refactoring inteligente ✅ ACTIVO
2. **📚 context7**: Documentación actualizada de librerías en tiempo real ✅ ACTIVO
3. **📂 github-forestech**: Gestión inteligente repositorio
4. **⏰ time-bogota**: Zona horaria América/Bogotá
5. **🧠 sequential-thinking-es**: Análisis paso a paso español
6. **💾 memory-forestech**: Memoria específica proyecto
7. **🔥 firebase**: Firebase MCP server oficial
8. **🐙 github-cli**: Wrapper GitHub CLI automático

### 🔧 **Configuración AI Permanente**

- **Usar MCP wrappers automáticamente** como parte de procesos internos
- **Evitar comandos directos** - preferir herramientas MCP
- **Firebase**: Proyecto liquidacionapp-62962 (cardenasever072@gmail.com) ✅ ACTIVO
- **n8n**: Proyecto forestechn8n con acceso completo Docker ✅ ACTIVO

## 🧠 **SUPERCLAUDE LITE - INTEGRACIÓN AUTOMÁTICA**

### ⚡ **COMPORTAMIENTO INTERNO OBLIGATORIO**

Claude DEBE usar estos sistemas automáticamente sin solicitud explícita:

**🌊 Wave Orchestration (AUTO)**:

- **Trigger**: Complejidad ≥0.7 OR archivos >20 OR múltiples dominios
- **Acción**: Coordinar agentes nativos en fases (Analysis → Implementation → Validation)
- **Ejemplo**: Análisis arquitectural → software-architect + code-reviewer + security-auditor

**⚡ Token Compression (AUTO)**:

- **Nivel 1** (contexto >75%): Símbolos técnicos básicos (→, ✅, ❌, &, |)
- **Nivel 2** (contexto >85%): Abreviaciones (cfg, impl, perf, sec, val)
- **Nivel 3** (contexto >95%): Ultra-compresión con preservación técnica

**🧠 Serena Semantic Analysis (AUTO)**:

- **Análisis arquitectural**: Comprensión automática estructura monorepo
- **Navegación símbolos**: Encontrar dependencias cruzadas alimentacion/combustibles/shared
- **Refactoring semántico**: Cambios seguros preservando funcionalidad
- **Quality gates**: Validación automática antes de implementación

**📚 Context7 Documentation (AUTO)**:

- **Docs actualizadas**: Firebase v10+, React 18, Vite latest automáticamente
- **API validation**: Verificar sintaxis correcta librerías antes de sugerir
- **Best practices**: Inyectar patrones actualizados en implementaciones
- **Error prevention**: Evitar APIs obsoletas automáticamente

**🧠 Memory Pattern Storage (AUTO)**:

- **Guardar**: Soluciones exitosas, patrones arquitecturales, fixes de bugs
- **Consultar**: Antes de implementar, buscar patrones similares en memoria
- **Actualizar**: Después de cada solución exitosa

**🔥 Firebase Integration (AUTO)**:

- **Consultas proactivas**: Al analizar auth, Firestore, deployment
- **Data context**: Incluir datos reales en análisis cuando relevante
- **Performance checks**: Queries optimization automático

### 🎯 **COMANDOS SLASH INTERNOS**

Claude interpreta internamente (sin que usuario los escriba):

**`/analyze` (AUTO-TRIGGER)**:

- **Cuándo**: Solicitudes de análisis, troubleshooting, "revisar código"
- **Agentes**: software-architect + code-reviewer + security-auditor
- **MCPs**: Serena (análisis semántico) + Context7 (docs actualizadas) + Memory (patrones) + Firebase (datos)

**`/build` (AUTO-TRIGGER)**:

- **Cuándo**: "compilar", "deploy", "generar build"
- **Agentes**: software-architect + performance-optimizer
- **MCPs**: Serena (validación estructura) + Context7 (best practices build) + GitHub CLI (PRs) + Firebase (deploy)

**`/implement` (AUTO-TRIGGER)**:

- **Cuándo**: "crear feature", "implementar", "desarrollar"
- **Agentes**: Selección automática según dominio detectado
- **MCPs**: Serena (navegación símbolos) + Context7 (APIs actualizadas) + Memory (patrones) + GitHub CLI (branches)

**`/improve` (AUTO-TRIGGER)**:

- **Cuándo**: "optimizar", "mejorar", "refactorizar"
- **Agentes**: code-reviewer + performance-optimizer + security-auditor
- **MCPs**: Serena (refactoring semántico) + Context7 (mejores prácticas) + Memory (guardar mejoras) + Firebase (performance)

### 🚀 **FLAGS AUTOMÁTICOS**

Claude aplica automáticamente según contexto:

**`--wave-mode auto`**: Proyectos >50 archivos o complejidad alta
**`--compress auto`**: Uso contexto >75%
**`--focus [domain]`**: Según keywords detectados (security, performance, architecture)
**`--scope system`**: Cambios que afectan múltiples apps
**`--memory-save`**: SIEMPRE activo para guardar patrones

## 🎯 **SELECTOR DE PROYECTO - IMPORTANTE**

**AL INICIAR CADA SESIÓN, CLAUDE DEBE PREGUNTAR:**

```
🔍 ¿En qué proyecto de Forestech trabajamos hoy?

🍽️  1. ALIMENTACION - App de liquidaciones de comidas
⛽  2. COMBUSTIBLES - App de gestión de combustibles
🔧  3. SHARED - Recursos compartidos entre apps
📋  4. GENERAL - Configuración global del monorepo

Responde con el número (1-4) para establecer el contexto correcto.
```

## 🤖 **COMPORTAMIENTO AUTOMÁTICO DE CLAUDE**

**⚡ ANÁLISIS AUTOMÁTICO:** Claude ejecuta automáticamente análisis profundo sin necesidad de solicitudes específicas.

### ⚡ **COMPORTAMIENTO AUTOMÁTICO MEJORADO**

- **SuperClaude Lite integrado**: Wave orchestration, token compression, memory patterns
- **Agentes nativos coordinados**: software-architect, code-reviewer, security-auditor, performance-optimizer, ux-ui-evaluator
- **MCPs enterprise activados**: Serena (análisis semántico) + Context7 (docs actualizadas) + Firebase + Memory + GitHub CLI
- **Herramientas paralelas optimizadas**: Máximo rendimiento en operaciones complejas
- **Context switching inteligente**: Auto-detección alimentacion/combustibles/shared/general

### 🔄 **WORKFLOW INTERNO AUTOMATIZADO**

1. **Context Detection** → Detectar dominio y complejidad automáticamente
2. **Serena Analysis** → Análisis semántico automático estructura código y dependencias
3. **Context7 Validation** → Verificar APIs actualizadas y best practices
4. **Agent Coordination** → Activar agentes nativos apropiados según contexto
5. **MCP Integration** → Consultar Firebase, Memory, GitHub CLI proactivamente
6. **Wave Orchestration** → Multi-fase para operaciones complejas (>0.7 complejidad)
7. **Token Optimization** → Compresión adaptativa según uso contexto
8. **Pattern Storage** → Guardar soluciones exitosas en Memory MCP
9. **Quality Validation** → Validación automática con agentes especializados

## 📚 **DOCUMENTACIÓN MODULAR**

**Para información técnica del proyecto, consultar:**

- **📂 Estructura**: [docs/project/STRUCTURE.md](./docs/project/STRUCTURE.md)
- **⚙️ Comandos**: [docs/project/COMMANDS.md](./docs/project/COMMANDS.md)
- **📊 Estado**: [docs/project/STATUS.md](./docs/project/STATUS.md)
- **🚀 CI/CD**: [docs/project/CICD.md](./docs/project/CICD.md)

**Para contexto automático del proyecto:**

- **Auto-context loading**: `.github/copilot-instructions.md`
- **Apps específicas**: `docs/[alimentacion|combustibles|shared]/README.md`

## 🔧 **ACCESO N8N GOOGLE CLOUD - PROYECTO forestechn8n**

**Claude tiene acceso completo al servidor n8n para automatizaciones y workflows:**

### 🌐 **INFORMACIÓN DEL SERVIDOR**

- **Proyecto GCP**: `forestechn8n`
- **VM**: `servern-n8n-forestech` (zona: us-central1-a)
- **IP Externa**: `146.148.84.233`
- **Web UI**: `https://n8n.forestechdecolombia.com.co`
- **Usuario**: `cardenasever072@gmail.com`

### 🐳 **CONFIGURACIÓN DOCKER**

- **Contenedor**: n8n (ID dinámico)
- **Puerto**: 5678 (mapeado 0.0.0.0:5678->5678/tcp)
- **Imagen**: `n8nio/n8n:latest`
- **Datos**: `/home/cardenasever072/.n8n` (host) → `/home/node/.n8n` (contenedor)

### ⚡ **COMANDOS DE ACCESO RÁPIDO**

**Conectar a VM:**

```bash
gcloud config set project forestechn8n
gcloud compute ssh servern-n8n-forestech --zone=us-central1-a
```

**Gestión contenedor n8n:**

```bash
# Ver estado
docker ps | grep n8n
docker logs n8n

# Acceder al contenedor
docker exec -it n8n bash

# Comandos CLI n8n
docker exec n8n n8n list:workflow
docker exec n8n n8n import:workflow --input=/tmp/workflow.json
docker exec n8n n8n export:workflow --id=1 --output=/tmp/
```

**Transferir archivos:**

```bash
# Local → VM
gcloud compute scp archivo.json servern-n8n-forestech:/tmp/ --zone=us-central1-a

# VM → Contenedor
docker cp /tmp/archivo.json n8n:/tmp/
```

### 🗄️ **BASE DE DATOS Y ARCHIVOS**

- **SQLite DB**: `/home/node/.n8n/database.sqlite` (dentro contenedor)
- **Config**: `/home/node/.n8n/config`
- **Logs**: `/home/node/.n8n/n8nEventLog*.log`

### 🔑 **CREDENCIALES CONFIGURADAS**

- **Gmail API**: `cardenasever072@gmail.com` ✅
- **Firebase**: Proyecto `liquidacionapp-62962` ✅
- **WhatsApp Business**: Por configurar
- **Slack Webhooks**: Por configurar

### 📊 **WORKFLOWS EXISTENTES**

- **ID 1**: "SSR Alerts → Multi-channel Notifications" ✅ IMPORTADO
- **Webhook URL**: `https://n8n.forestechdecolombia.com.co/webhook/ssr-alerts`

### 🚀 **ROADMAP N8N IMPLEMENTADO**

- **Fase 1.1**: Alertas SSR → Notificaciones (EN PROGRESO)
- **Documentación**: `docs/n8n/N8N_ROADMAP_FORESTECH.md`
- **Workflows**: `docs/n8n/workflow-*.json`

### ⚠️ **NOTAS IMPORTANTES**

- n8n ejecutándose en Docker, NO instalado via npm
- Configuración remota difiere del Docker local
- Permisos archivo config: 0700 (warning ignorable)
- Task runners deprecated: considerar `N8N_RUNNERS_ENABLED=true`

### 🔧 **TROUBLESHOOTING RÁPIDO**

```bash
# Reiniciar n8n
docker restart n8n

# Ver logs en tiempo real
docker logs -f n8n

# Backup workflows
docker exec n8n n8n export:workflow --all --output=/tmp/backup/
```

## 📘 **ESTRUCTURA JSON DE WEBHOOKS N8N - DOCUMENTACIÓN TÉCNICA**

### 🔗 **Estructura Estándar de Input en n8n**

Cuando n8n recibe un Webhook, el input se organiza en JSON con estas partes:

```json
[
  {
    "headers": {
      "host": "n8n.forestechdecolombia.com.co",
      "content-type": "application/json",
      "user-agent": "Combustibles-App/1.0"
    },
    "params": {},
    "query": {},
    "body": {
      // 👈 AQUÍ ESTÁN LOS DATOS IMPORTANTES
      "eventType": "login|movement",
      "timestamp": "2025-08-21T00:00:00Z",
      "user": {
        /* datos del usuario */
      },
      "app": "combustibles"
    },
    "webhookUrl": "https://n8n.forestechdecolombia.com.co/webhook/[endpoint]",
    "executionMode": "production"
  }
]
```

### ⚡ **Expresiones para Acceder a Datos**

**Login Events:**

```javascript
// Datos básicos del usuario
Email: {{$json["body"]["user"]["email"]}}
Nombre: {{$json["body"]["user"]["displayName"]}}
Rol: {{$json["body"]["user"]["role"]}}
UID: {{$json["body"]["user"]["uid"]}}

// Permisos específicos
Puede crear movimientos: {{$json["body"]["user"]["permissions"]["canCreateMovements"]}}
Puede ver reportes: {{$json["body"]["user"]["permissions"]["canViewReports"]}}
Es admin: {{$json["body"]["user"]["permissions"]["canModifySettings"]}}

// Metadata
Método de login: {{$json["body"]["loginMethod"]}}
Email verificado: {{$json["body"]["user"]["emailVerified"]}}
Timestamp: {{$json["body"]["timestamp"]}}
App: {{$json["body"]["app"]}}
```

**Movement Events:**

```javascript
// Datos del movimiento
ID: {{$json["body"]["movement"]["id"]}}
Tipo: {{$json["body"]["movement"]["type"]}}
Combustible: {{$json["body"]["movement"]["fuelType"]}}
Cantidad: {{$json["body"]["movement"]["quantity"]}}
Precio unitario: {{$json["body"]["movement"]["unitPrice"]}}
Valor total: {{$json["body"]["movement"]["totalValue"]}}
Vehículo: {{$json["body"]["movement"]["vehicleId"]}}
Ubicación: {{$json["body"]["movement"]["location"]}}
Descripción: {{$json["body"]["movement"]["description"]}}
Fecha efectiva: {{$json["body"]["movement"]["effectiveDate"]}}

// Usuario que creó el movimiento
Creado por: {{$json["body"]["createdBy"]["email"]}}
Nombre del creador: {{$json["body"]["createdBy"]["displayName"]}}
Rol del creador: {{$json["body"]["createdBy"]["role"]}}
UID del creador: {{$json["body"]["createdBy"]["uid"]}}
```

### 📱 **Plantillas de Mensajes Telegram**

**Login Notification:**

```
🔐 ACCESO AL SISTEMA 🔐

📧 Usuario: {{$json["body"]["user"]["email"]}}
🙍 Nombre: {{$json["body"]["user"]["displayName"]}}
👤 Rol: {{$json["body"]["user"]["role"]}}

🕒 Hora: {{$json["body"]["timestamp"]}}
🌐 Método: {{$json["body"]["loginMethod"]}}
📲 App: {{$json["body"]["app"]}}

✅ Permisos activos:
{{#if $json["body"]["user"]["permissions"]["canManageInventory"]}}• Gestionar inventario{{/if}}
{{#if $json["body"]["user"]["permissions"]["canCreateMovements"]}}• Crear movimientos{{/if}}
{{#if $json["body"]["user"]["permissions"]["canViewReports"]}}• Ver reportes{{/if}}

🟢 Estado: Acceso exitoso
```

**Movement Notification:**

```
🚛 MOVIMIENTO DE COMBUSTIBLE 🚛

🆔 ID: {{$json["body"]["movement"]["id"]}}
📋 Tipo: {{$json["body"]["movement"]["type"]}}
⛽ Combustible: {{$json["body"]["movement"]["fuelType"]}}
📊 Cantidad: {{$json["body"]["movement"]["quantity"]}} galones
💵 Precio Unitario: ${{$json["body"]["movement"]["unitPrice"]}}
💰 Valor Total: ${{$json["body"]["movement"]["totalValue"]}}
📅 Fecha: {{$json["body"]["movement"]["effectiveDate"]}}
🚗 Vehículo: {{$json["body"]["movement"]["vehicleId"]}}
📍 Ubicación: {{$json["body"]["movement"]["location"]}}
📝 Descripción: {{$json["body"]["movement"]["description"]}}

👤 Registrado por: {{$json["body"]["createdBy"]["displayName"]}} ({{$json["body"]["createdBy"]["role"]}})
📧 Correo: {{$json["body"]["createdBy"]["email"]}}

✅ Movimiento registrado exitosamente en la app: {{$json["body"]["app"]}}
```

### 🛠️ **GUÍA PARA CREAR NUEVOS WORKFLOWS N8N**

#### **Paso 1: Crear Webhook Node**

1. Drag & Drop **Webhook** node
2. **HTTP Method**: POST
3. **Path**: `nombre-descriptivo-webhook`
4. **Response Mode**: "Response Node" o "Last Node"

#### **Paso 2: Agregar Switch Node para Eventos**

```javascript
// Configuración del Switch Node
Data Type: String
Value 1: ={{$json.eventType}}

// Reglas:
Output 0: eventType equals "login"
Output 1: eventType equals "movement"
Output 2: eventType equals "error"
```

#### **Paso 3: Configurar Telegram Nodes**

1. **Chat ID**: `6779034430`
2. **Bot Token**: `8440084966:AAEN19jaLhot2FAHPCmhbsjnDRaUb4RZQdA`
3. **Message**: Usar plantillas de arriba

#### **Paso 4: Testing**

```bash
# Test del webhook
curl -X POST https://n8n.forestechdecolombia.com.co/webhook/[tu-endpoint] \
-H "Content-Type: application/json" \
-d '{"eventType":"test","timestamp":"2025-08-21T00:00:00Z","message":"Test workflow","app":"tu-app"}'
```

#### **Paso 5: Activar Workflow**

1. Click en **"Active"** toggle
2. Verificar que el webhook esté **"Listening"**
3. Test con datos reales desde la app

### 🔄 **PATRONES COMUNES N8N**

**Conditional Logic:**

```javascript
// En Function Node para lógica compleja
if ($json.body.user.role === 'admin') {
  return [
    {
      message: 'Admin access detected',
      priority: 'high',
    },
  ];
}
```

**Data Transformation:**

```javascript
// En Set Node para transformar datos
return {
  username: $json.body.user.email.split('@')[0],
  isVerified: $json.body.user.emailVerified,
  roleLevel: $json.body.user.role === 'admin' ? 3 : 1,
};
```

**Error Handling:**

- Siempre usar **Error Trigger** nodes
- Configurar **retry logic** en HTTP nodes
- Implementar **fallback notifications**

### 🚀 **WORKFLOW PATTERNS & BEST PRACTICES**

**🔄 Error Handling Pattern:**

```javascript
// En cada nodo, agregar error handling
try {
  // Operación principal
} catch (error) {
  // Log del error
  return {
    error: true,
    message: error.message,
    timestamp: new Date().toISOString(),
  };
}
```

**⚡ Performance Optimization:**

```javascript
// Usar filter nodes para reducir ejecuciones innecesarias
// Expresión de filtro:
={{$json.eventType === 'login' || $json.eventType === 'movement'}}

// Timeout configurado en webhook (5s máximo)
// Retry logic en aplicación cliente
```

**🔒 Security Considerations:**

```javascript
// Validar estructura de datos esperada
={{$json.app === 'combustibles' && $json.eventType}}

// No logear información sensible en n8n
// Usar environment variables para tokens
```

**📊 Multi-Channel Support:**

```yaml
# Estructura para múltiples canales
channels:
  telegram:
    enabled: true
    chat_id: 6779034430
  slack:
    enabled: false
    webhook_url: ''
  email:
    enabled: false
    recipients: []
```

---

**📌 Reglas de comportamiento Claude Code - Agosto 2025**
