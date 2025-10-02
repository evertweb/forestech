# 🚀 DEPLOYMENT CARD - FORESTECH

> **📌 PEGALA EN TU ESCRITORIO - Referencia ultra-rápida**

## ⚡ DEPLOYMENTS EN 30 SEGUNDOS

### 🔥 **Frontend cambió**
```bash
git push origin main
# ✅ Auto-deploy Firebase (3-5 min)
# ✅ Auto-run: Smoke Tests + Lighthouse CI
```

### ☁️ **Backend cambió**  
```bash
git push origin main
# 🔴 GitHub Actions → "Deploy to Cloud Run" → force_deploy: true
```

### 🚀 **Ambos cambiaron**
```bash
git push origin main                           # Auto-deploy Frontend + CI
# + GitHub Actions → "Deploy to Cloud Run"    # Manual Backend  
```

---

## 🌐 **URLs PRODUCTION**
- **🎯 Main**: https://combustibles.forestechdecolombia.com.co
- **🍽️ Food**: https://forestechdecolombia.web.app/alimentacion
- **🔧 API**: https://forestech-sql-service-851382130132.us-central1.run.app/health
- **📊 Metrics**: https://console.firebase.google.com/project/liquidacionapp-62962/performance

---

## ✅ **PRE-DEPLOY CHECKLIST** (Sprint 4)

- [ ] `npm run lint:all` → ✅ Verde
- [ ] `npm run build:all` → ✅ Sin errores
- [ ] PR checks → ✅ Lighthouse ≥90, E2E pass
- [ ] Performance budget → ✅ Sin excesos

---

## 📊 **CI/CD WORKFLOWS** (Automáticos en PR)

| Workflow | Trigger | Duración | Thresholds |
|----------|---------|----------|------------|
| 🧪 **Smoke Tests** | Push/PR | ~10min | Lint + Build pass |
| 🔦 **Lighthouse CI** | PR a main | ~15min | Perf/A11y/BP/SEO ≥90 |
| 🧪 **E2E Tests** | Push/PR | ~8min | Flows críticos pass |

---

## 💰 **PERFORMANCE BUDGETS**
- **Total**: 350kb max (actual: -31% vs baseline)
- **App.jsx**: 12kb max (-68%)
- **MovementWizard**: 8kb max (-84%)
- **Vendor**: 250kb max

---

## 📈 **WEB VITALS** (Firebase Performance)
| Métrica | Target | Monitor |
|---------|--------|---------|
| LCP | <2.5s | 🟢 Auto |
| FID | <100ms | 🟢 Auto |
| CLS | <0.1 | 🟢 Auto |
| FCP | <1.8s | 🟢 Auto |

Ver dashboard: Firebase Console → Performance

---

## 🆘 **EMERGENCY**
1. **Deploy falla** → Ver logs GitHub Actions
2. **Site down** → Check Firebase Console  
3. **API down** → Check Cloud Run Console
4. **Rollback** → Redeploy commit anterior
5. **CI falla** → Ver artifacts + logs en Actions

---

## 🔍 **QUICK DEBUG**
```bash
# Local lighthouse check
cd combustibles
npm run build
npx vite preview --port 4173
npx @lhci/cli autorun --config=../lighthouserc-desktop.json

# Local performance budget
bash scripts/performance-budget-check.sh

# Local E2E
npm run e2e --workspace=combustibles
```

---

**📖 Guía completa: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**  
**📊 Performance: [FIREBASE_PERFORMANCE_MONITORING.md](./docs/FIREBASE_PERFORMANCE_MONITORING.md)**  
**📅 Última actualización: Octubre 2025 (Sprint 4, Día 4)**