# 🚨 Rollback Plan - Fase 1 SSR

## 🎯 Objetivo

Plan de rollback rápido para revertir cambios de Fase 1 SSR en caso de issues críticos en producción.

---

## ⚡ Rollback Rápido (< 5 minutos)

### 1. Rollback Automático via A/B Testing

```bash
# Desactivar Dashboard SSR inmediatamente (10% → 0%)
curl "https://forestechdecolombia.com.co/ab-testing?action=rollback&route=/combustibles/dashboard"

# Verificar rollback
curl "https://forestechdecolombia.com.co/ab-testing?action=status" | jq '.config."/combustibles/dashboard".percentage'
```

### 2. Rollback Manual via Remote Config

```bash
# Si A/B testing falla, usar env variables
firebase functions:config:set ssr.dashboard_ssr_enabled=false
firebase deploy --only functions:ssrCombustibles
```

### 3. Rollback Completo (Emergency)

```bash
# Revertir a commit anterior
git revert ec464e0 --no-edit
git push origin main
firebase deploy --only functions:ssrCombustibles
```

---

## 📊 Triggers de Rollback

### 🚨 Automático (Sistema hace rollback)

- **Error rate >5%** en 5 minutos
- **Response time >3000ms** en 10 requests consecutivos
- **500 errors >3** en 1 minuto
- **Health check fails** por >2 minutos

### ⚠️ Manual (Equipo decide)

- **User complaints** sobre performance
- **SEO ranking drop** detectado
- **Firebase quota** cerca del límite
- **Monitoring alerts** persistentes

---

## 🔍 Monitoreo Post-Rollback

### Métricas a verificar:

```bash
# 1. Verificar que SSR está desactivado
curl -I https://forestechdecolombia.com.co/combustibles/dashboard | grep "x-fallback"

# 2. Verificar performance vuelve a normal
./validate-performance-metrics.js

# 3. Verificar logs de errores
firebase functions:log --only ssrCombustibles --limit 50

# 4. Verificar status de Firebase Functions
firebase functions:list
```

### Alertas a configurar:

- **Slack webhook** para notificaciones inmediatas
- **Email alerts** para equipo DevOps
- **Dashboard monitoring** con métricas críticas

---

## 📋 Checklist Post-Rollback

### ✅ Inmediato (< 15 min)

- [ ] Verificar que Dashboard carga correctamente
- [ ] Verificar que Landing page funciona
- [ ] Revisar logs de Firebase Functions
- [ ] Confirmar que métricas se normalizan
- [ ] Notificar al equipo del rollback

### ✅ Seguimiento (< 1 hora)

- [ ] Analizar causa raíz del issue
- [ ] Documentar lecciones aprendidas
- [ ] Crear plan de corrección
- [ ] Comunicar timeline de re-deploy
- [ ] Revisar alertas y thresholds

### ✅ Post-mortem (< 24 horas)

- [ ] Reunión de equipo para análisis
- [ ] Documentar incidente completo
- [ ] Mejorar tests y validaciones
- [ ] Actualizar procedimientos
- [ ] Planificar re-intento

---

## 🛠️ Comandos de Emergencia

### Verificación rápida del estado:

```bash
# Status general
curl -w "%{response_code}:%{time_total}\n" -s -o /dev/null https://forestechdecolombia.com.co/combustibles/

# A/B testing status
curl https://forestechdecolombia.com.co/ab-testing?action=status | jq '.config'

# Performance check
curl -w "TTFB:%{time_starttransfer} Total:%{time_total}\n" -s -o /dev/null https://forestechdecolombia.com.co/combustibles/dashboard
```

### Rollback gradual:

```bash
# Reducir gradualmente el tráfico SSR
curl "https://forestechdecolombia.com.co/ab-testing?action=update&route=/combustibles/dashboard&percentage=5"  # 10% → 5%
curl "https://forestechdecolombia.com.co/ab-testing?action=update&route=/combustibles/dashboard&percentage=1"  # 5% → 1%
curl "https://forestechdecolombia.com.co/ab-testing?action=update&route=/combustibles/dashboard&percentage=0"  # 1% → 0%
```

### Logs debugging:

```bash
# Logs recientes con errores
firebase functions:log --only ssrCombustibles --limit 100 | grep -E "(ERROR|WARN|SSR_)"

# Performance logs
firebase functions:log --only ssrCombustibles --limit 50 | grep "SSR_PERF"

# A/B testing logs
firebase functions:log --only ssrCombustibles --limit 50 | grep "A_B_TEST"
```

---

## 📞 Contactos de Emergencia

### Primary Response Team:

- **Lead Developer**: [Contact info]
- **DevOps**: [Contact info]
- **Product Owner**: [Contact info]

### Escalation:

- **CTO/Technical Lead**: [Contact info]
- **Firebase Support**: [Support channel]

---

## 🔧 Testing del Plan de Rollback

### Simulación mensual:

```bash
# 1. Trigger rollback en staging
curl "https://staging-forestechdecolombia.com.co/ab-testing?action=rollback&route=/combustibles/dashboard"

# 2. Verificar que funciona
./validate-performance-metrics.js

# 3. Restaurar staging
curl "https://staging-forestechdecolombia.com.co/ab-testing?action=update&route=/combustibles/dashboard&percentage=10"
```

### Validación del plan:

- [ ] Scripts de rollback probados
- [ ] Tiempos de rollback <5 minutos validados
- [ ] Alertas funcionando correctamente
- [ ] Equipo entrenado en procedimientos
- [ ] Documentación actualizada

---

## 📝 Historia de Rollbacks

### Fase 1 (Diciembre 2024):

- **Deploy inicial**: ec464e0
- **Rollbacks**: Ninguno (yet)
- **Issues conocidos**: Ninguno mayor

### Template para futuros rollbacks:

```
Fecha: [DATE]
Trigger: [ERROR_TYPE]
Duración: [MINUTES]
Método: [AUTO/MANUAL]
Causa: [ROOT_CAUSE]
Solución: [RESOLUTION]
```

---

**🎯 Objetivo**: Zero downtime, máximo 5 minutos para rollback completo.
**📊 SLA**: 99.9% uptime mantenido durante rollouts y rollbacks.
