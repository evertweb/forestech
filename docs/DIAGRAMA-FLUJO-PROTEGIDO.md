# 🔄 DIAGRAMA DE FLUJO PROTEGIDO - FORESTECH

## 📊 Flujo Original (Riesgoso)
```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    PUSH     │───▶│  ERROR DETECT   │───▶│  COPILOT AGENT  │
│   (main)    │    │   (2 workflows) │    │   CREATE PR     │
└─────────────┘    └─────────────────┘    └─────────────────┘
       ▲                                            │
       │                                            ▼
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  ♻️ LOOP ♻️  │◀───│     MERGE       │◀───│    PR READY     │
│  INFINITO   │    │   (auto/manual) │    │                 │
└─────────────┘    └─────────────────┘    └─────────────────┘
```

## ✅ Flujo Protegido (Actual)
```
┌─────────────┐    ┌─────────────────────┐
│    PUSH     │───▶│  🛡️ CIRCUIT BREAKER │
│   (main)    │    │   Check commits     │
└─────────────┘    └─────────────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │   ERROR DETECTION   │
                    │  (copilot-bridge)   │
                    └─────────────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │  🛡️ RATE LIMITING   │
                    │ Check existing      │
                    │ issues (3/hour)     │
                    └─────────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
            ┌──────────────┐   ┌──────────────┐
            │   SKIP       │   │    CREATE    │
            │ (protected)  │   │    ISSUE     │
            └──────────────┘   └──────────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │ COPILOT AGENT│
                              │   (external) │
                              └──────────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │   CREATE PR  │
                              │              │
                              └──────────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │    MERGE     │
                              │  (triggers)  │
                              └──────────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │  PUSH AGAIN  │
                              │      ↓       │
                              │ 🛡️ PROTECTED │
                              └──────────────┘
```

## 🚧 Puntos de Protección

### 1. **Circuit Breaker (deploy-firebase.yml)**
```
IF commits > 3 in recent history:
  ├─ STOP deployment
  ├─ Show warning message
  └─ EXIT with protection status
```

### 2. **Rate Limiting (copilot-bridge.yml)**
```
BEFORE creating Copilot issue:
  ├─ Check issues in last hour (max: 3)
  ├─ Check duplicates in last 10 min
  └─ IF safe: create issue
     ELSE: skip with protection log
```

### 3. **Monitoring (monitor-bucles.yml)**
```
EVERY 30 minutes (8AM-8PM):
  ├─ Check workflow frequency
  ├─ Analyze Copilot issues
  ├─ Detect commit patterns
  └─ IF anomaly: create alert issue
```

### 4. **Disabled Redundancy**
```
copilot-integration.yml:
  ├─ TEMPORARILY DISABLED (if: false)
  ├─ Prevents double issue creation
  └─ Will be re-enabled with coordination
```

## 📈 Métricas de Protección

### **Indicadores de Salud:**
- 🟢 **Normal**: < 3 workflows/hour, < 2 issues/hour
- 🟡 **Advertencia**: 3-5 workflows/hour, 2-3 issues/hour  
- 🔴 **Crítico**: > 5 workflows/hour, > 3 issues/hour

### **Contadores de Protección:**
```
Rate Limiting Activations: 0/day
Circuit Breaker Triggers: 0/day
Monitor Alerts Generated: 0/day
Duplicate Issues Prevented: 0/day
```

## 🔧 Estados del Sistema

### **Estado Normal:**
```
┌─────────────────────────────────────────┐
│               FORESTECH                 │
│           🟢 OPERACIÓN NORMAL           │
├─────────────────────────────────────────┤
│ Circuit Breaker: ✅ Ready               │
│ Rate Limiting: ✅ Active                │
│ Monitoring: ✅ Running                  │
│ Issues Created: 0-2/hour                │
│ Workflows: 1-3/hour                     │
└─────────────────────────────────────────┘
```

### **Estado Protegido:**
```
┌─────────────────────────────────────────┐
│               FORESTECH                 │
│          🟡 PROTECCIÓN ACTIVA           │
├─────────────────────────────────────────┤
│ Circuit Breaker: 🚧 ACTIVATED           │
│ Rate Limiting: 🛡️ BLOCKING             │
│ Monitoring: 🔍 ANALYZING                │
│ Issues Created: PAUSED                  │
│ Workflows: SUSPENDED                    │
└─────────────────────────────────────────┘
```

### **Estado de Alerta:**
```
┌─────────────────────────────────────────┐
│               FORESTECH                 │
│            🔴 ALERTA CRÍTICA            │
├─────────────────────────────────────────┤
│ Circuit Breaker: 🚨 CRITICAL            │
│ Rate Limiting: 🛡️ MAXIMUM               │
│ Monitoring: 📢 ALERTING                 │
│ Issues Created: BLOCKED                 │
│ Workflows: EMERGENCY STOP               │
└─────────────────────────────────────────┘
```

## 🎯 Flujo de Recuperación

### **Recuperación Automática:**
```
1. Monitor detecta normalización
2. Circuit breaker se resetea (1 hora)
3. Rate limiting se ajusta
4. Workflows se reactivan gradualmente
```

### **Recuperación Manual:**
```
1. Administrador revisa alertas
2. Identifica y corrige causa raíz
3. Resetea protecciones manualmente
4. Verifica operación normal
5. Cierra issues de alerta
```

---

**Leyenda:**
- 🟢 Normal / Saludable
- 🟡 Advertencia / Protegido  
- 🔴 Crítico / Bloqueado
- 🛡️ Protección Activa
- 🚧 Circuit Breaker
- 📢 Sistema de Alertas
