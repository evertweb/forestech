# 🚀 DEPLOYMENT CARD - FORESTECH

> **📌 PEGALA EN TU ESCRITORIO - Referencia ultra-rápida**

## ⚡ DEPLOYMENTS EN 30 SEGUNDOS

### 🔥 **Frontend cambió**
```bash
git push origin main
# ✅ Auto-deploy Firebase (3-5 min)
```

### ☁️ **Backend cambió**  
```bash
git push origin main
# 🔴 GitHub Actions → "Deploy to Cloud Run" → force_deploy: true
```

### 🚀 **Ambos cambiaron**
```bash
git push origin main                           # Auto-deploy Frontend
# + GitHub Actions → "Deploy to Cloud Run"    # Manual Backend  
```

---

## 🌐 **URLs PRODUCTION**
- **🎯 Main**: https://combustibles.forestechdecolombia.com.co
- **🍽️ Food**: https://forestechdecolombia.web.app/alimentacion
- **🔧 API**: https://forestech-sql-service-851382130132.us-central1.run.app/health

---

## 🆘 **EMERGENCY**
1. **Deploy falla** → Ver logs GitHub Actions
2. **Site down** → Check Firebase Console  
3. **API down** → Check Cloud Run Console
4. **Rollback** → Redeploy commit anterior

---

**📖 Guía completa: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**