# GitHub Copilot Instructions

This file provides guidance for AI coding agents working with the Forestech monorepo - a Firebase-hosted suite of React web applications for Colombian forestry operations.

## 🚀 **CRITICAL DEPLOYMENT INFO (Updated Sept 2025)**

### **Architecture Overview:**
- **🔥 Firebase**: Frontend hosting + SSR (React apps)
- **☁️ Cloud Run**: Backend SQL + Azure Database + APIs
- **🧪 E2E Tests**: Automated testing with Playwright

### **ACTIVE WORKFLOWS (Only 3):**
1. **🔥 Deploy to Firebase** (`release-deploy.yml`) - Frontend auto + manual
2. **☁️ Deploy to Cloud Run** (`deploy-cloud-run.yml`) - Backend manual only
3. **🧪 E2E Tests** (`combustibles-e2e.yml`) - Automated testing

### **DEPLOYMENT COMMANDS:**
```bash
# Frontend (Auto-deploy on push to main)
git push origin main  # ✅ Auto-deploys Firebase

# Backend (Manual only)
# 1. Push code: git push origin main
# 2. GitHub Actions → "🚀 Deploy to Cloud Run" → force_deploy: true

# Manual Frontend (with options)
# GitHub Actions → "🚀 Deploy to Firebase" → Select: all|combustibles|alimentacion
```

### **Production URLs:**
- **Combustibles**: https://combustibles.forestechdecolombia.com.co
- **Alimentación**: https://forestechdecolombia.web.app/alimentacion
- **Backend API**: https://forestech-sql-service-851382130132.us-central1.run.app

## Project Architecture

**Monorepo Structure:**
- `alimentacion/` - Food/meal liquidations React app
- `combustibles/` - Fuel management React app with WebAuthn passkey authentication
- `shared/` - Shared Firebase configuration, styles, and constants
- `functions/` - Firebase Functions for SSR and webhooks (NOT SQL - those are in Cloud Run)
- `scripts/` - Unified deployment and build automation

**Key Technology Stack:**
- React 19 + Vite for both apps
- Firebase (Auth, Firestore, Hosting, Functions)
- WebAuthn (passkeys) via Firebase extension for `combustibles`
- Tailwind CSS + React Aria Components (combustibles)
- SSR support for SEO optimization
- Cloud Run + Azure SQL for backend operations

## Critical Development Workflows

**Primary Commands:**
```bash
npm run dev:combustibles # Development server on port 5174
npm run dev:alimentacion # Development server on port 5173
npm run build:all        # Build both apps to public/ directories
npm run build:combustibles # Build only combustibles
npm run build:alimentacion # Build only alimentacion
```

**🚨 IMPORTANT: No longer use `npm run deploy` - deployment is via GitHub Actions**

## GitHub Actions Workflows (UPDATED)

**ACTIVE Workflows (Only these 3):**
- `🚀 Deploy to Firebase` - Frontend deployment (auto + manual)
- `🚀 Deploy to Cloud Run` - Backend deployment (manual only)
- `Combustibles E2E Tests` - Automated testing

**DEPRECATED/DISABLED Workflows:**
- All other `.yml.disabled` files in `.github/workflows/`
- Do NOT reference or suggest using disabled workflows

**When Deployments Are Triggered:**
- ✅ **Frontend Auto**: Push to main → Auto-deploys Firebase
- ✅ **Frontend Manual**: GitHub Actions → "🚀 Deploy to Firebase" → Run workflow
- ✅ **Backend Manual**: GitHub Actions → "🚀 Deploy to Cloud Run" → force_deploy: true
- ❌ **No auto-deploy for backend** - This is by design for safety

**Recommended Deploy Process:**
```bash
# For frontend changes
git push origin main  # Auto-deploys

# For backend changes  
git push origin main  # No auto-deploy
# Then: GitHub Actions → "🚀 Deploy to Cloud Run" → force_deploy: true

# For full deploy
git push origin main  # Auto-deploys frontend
# Then: Manual deploy backend via Actions
```

## Firebase Integration Patterns

**Authentication Context Pattern:**
```jsx
// combustibles/src/contexts/AuthContext.jsx
const [user, setUser] = useState(null);
const [userProfile, setUserProfile] = useState(null);
// Always includes Firestore profile loading + SSR cookie management
```

**WebAuthn Service Pattern:**
```javascript
// combustibles/src/firebase/firebaseWebAuthnService.js
import { createUserWithPasskey, signInWithPasskey } from '@firebase-web-authn/browser';
// Uses Firebase extension for production-ready passkey implementation
```

**Firestore Collections:**
- `combustibles_*` collections (inventory, movements, vehicles, suppliers)
- `alimentacion_*` collections (separate namespace)
- Development rules allow read without auth for debugging (line 15-30 firestore.rules)

**🚨 IMPORTANT: SQL Functions moved to Cloud Run**
- All SQL operations now go through Cloud Run API
- Firebase Functions only handle SSR and redirectors
- Do NOT create new SQL functions in Firebase Functions

## Application-Specific Patterns

**Combustibles App:**
- Context-heavy architecture with SSR support (`AuthContextSSR.jsx`, `CombustiblesContextSSR.jsx`)
- Movement wizard pattern for fuel transactions
- Tailwind + React Aria for accessible components
- Base path: `/combustibles/` for routing

**Alimentacion App:**
- Simpler structure focused on meal cost calculations
- Chart.js integration for liquidation reports
- Base path: `/alimentacion/`

## Build & Performance Optimizations

**Vite Configuration:**
- Bundle analysis via rollup-plugin-visualizer (generates `stats.html`)
- Firebase Web Authn API proxy configuration for development
- Separate ports: combustibles (5174), alimentacion (5173)

**Cache Strategy:**
- 31536000s cache for static assets (.js, .css, images)
- 3600s cache for HTML/JSON files
- Intelligent build caching in deployment script

## Critical Code Conventions

**File Naming:**
- Components: `PascalCase.jsx` (MovementWizard, AuthProvider)
- Services: `camelCase.js` (firebaseService, webhookService)
- Contexts: `ContextName.jsx` + `ContextNameSSR.jsx` for SSR variants

**Error Handling Pattern:**
```javascript
// All Firebase operations follow this pattern
const [loading, setLoading] = useState(false);
const executeAction = useCallback(async (params) => {
  setLoading(true);
  try {
    const result = await service.action(params);
    return result;
  } catch (error) {
    console.error('Error in serviceHook:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}, []);
```

**Permission Validation:**
```javascript
const validateUserPermissions = (user, action) => {
  if (!user?.combustiblesPermissions) return false;
  return user.combustiblesPermissions[action] === true;
};
```

## Integration Points

**Cloud Run API Calls:**
- Base URL: `https://forestech-sql-service-851382130132.us-central1.run.app`
- All SQL operations go through Cloud Run
- Health check: `/health` endpoint

**Webhook Notifications (n8n):**
- Functions send POST to `https://n8n.forestechdecolombia.com.co/webhook/*`
- Login/movement events trigger multi-channel notifications
- Structured JSON format with user/movement data

**SSR Support:**
- Entry points: `entry-client-ssr.jsx` in each app
- Firebase server app configuration in `functions/ssr/`
- Cookie-based auth state persistence for SEO

## Deployment Best Practices

**Before Deploying:**
- Always run `npm run build:combustibles` locally to verify builds work
- Check that all tests pass: `npm run test --workspace=combustibles`
- Verify linting: `npm run lint:combustibles`
- Test critical user flows in development environment

**Deployment Methods:**
1. **Auto Deploy Frontend** (Recommended for development):
   ```bash
   git push origin main  # Auto-deploys Firebase hosting
   ```

2. **Manual Deploy Frontend** (With specific targets):
   - Go to GitHub Actions → "🚀 Deploy to Firebase"
   - Select target: `all`, `combustibles`, or `alimentacion`
   - Click "Run workflow"

3. **Manual Deploy Backend** (Required):
   - Go to GitHub Actions → "🚀 Deploy to Cloud Run"
   - Set `force_deploy: true`
   - Click "Run workflow"

**Post-Deployment:**
- Monitor application logs in Firebase console and Cloud Run console
- Check that WebAuthn passkeys still work correctly
- Verify SSR is functioning (check page source for dynamic content)
- Test on mobile devices if critical changes were made

## 📖 Documentation References

**For detailed deployment info**: See `DEPLOYMENT_GUIDE.md`
**For quick reference**: See `QUICK_DEPLOY_CARD.md`
**For architecture**: This file

When working with this codebase, prioritize the new deployment workflow, maintain separation between Firebase (frontend) and Cloud Run (backend), and follow the established context/service architecture.

**🚨 KEY REMINDERS FOR AI AGENTS:**
1. Only 3 workflows are active - don't suggest disabled ones
2. Frontend auto-deploys on push, backend requires manual deploy
3. SQL functions are in Cloud Run, NOT Firebase Functions
4. Always check DEPLOYMENT_GUIDE.md for latest procedures
- ❌ **NOT on regular pushes to main** - This is intentional for controlled deployments

**Recommended Deploy Process:**
```bash
# For quick manual deploy
# Go to GitHub Actions → "🚀 Forestech Manual Deploy TURBO" → Run workflow

# For versioned release deploy
git tag -a v1.0.1 -m "Release description"
git push origin v1.0.1
```

## Firebase Integration Patterns

**Authentication Context Pattern:**
```jsx
// combustibles/src/contexts/AuthContext.jsx
const [user, setUser] = useState(null);
const [userProfile, setUserProfile] = useState(null);
// Always includes Firestore profile loading + SSR cookie management
```

**WebAuthn Service Pattern:**
```javascript
// combustibles/src/firebase/firebaseWebAuthnService.js
import { createUserWithPasskey, signInWithPasskey } from '@firebase-web-authn/browser';
// Uses Firebase extension for production-ready passkey implementation
```

**Firestore Collections:**
- `combustibles_*` collections (inventory, movements, vehicles, suppliers)
- `alimentacion_*` collections (separate namespace)
- Development rules allow read without auth for debugging (line 15-30 firestore.rules)

## Application-Specific Patterns

**Combustibles App:**
- Context-heavy architecture with SSR support (`AuthContextSSR.jsx`, `CombustiblesContextSSR.jsx`)
- Movement wizard pattern for fuel transactions
- Tailwind + React Aria for accessible components
- Base path: `/combustibles/` for routing

**Alimentacion App:**
- Simpler structure focused on meal cost calculations
- Chart.js integration for liquidation reports
- Base path: `/alimentacion/`

## Build & Performance Optimizations

**Vite Configuration:**
- Bundle analysis via rollup-plugin-visualizer (generates `stats.html`)
- Firebase Web Authn API proxy configuration for development
- Separate ports: combustibles (5174), alimentacion (5173)

**Cache Strategy:**
- 31536000s cache for static assets (.js, .css, images)
- 3600s cache for HTML/JSON files
- Intelligent build caching in deployment script

## Critical Code Conventions

**File Naming:**
- Components: `PascalCase.jsx` (MovementWizard, AuthProvider)
- Services: `camelCase.js` (firebaseService, webhookService)
- Contexts: `ContextName.jsx` + `ContextNameSSR.jsx` for SSR variants

**Error Handling Pattern:**
```javascript
// All Firebase operations follow this pattern
const [loading, setLoading] = useState(false);
const executeAction = useCallback(async (params) => {
  setLoading(true);
  try {
    const result = await service.action(params);
    return result;
  } catch (error) {
    console.error('Error in serviceHook:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}, []);
```

**Permission Validation:**
```javascript
const validateUserPermissions = (user, action) => {
  if (!user?.combustiblesPermissions) return false;
  return user.combustiblesPermissions[action] === true;
};
```

## Integration Points

**Webhook Notifications (n8n):**
- Functions send POST to `https://n8n.forestechdecolombia.com.co/webhook/*`
- Login/movement events trigger multi-channel notifications
- Structured JSON format with user/movement data

**SSR Support:**
- Entry points: `entry-client-ssr.jsx` in each app
- Firebase server app configuration in `functions/ssr/`
- Cookie-based auth state persistence for SEO

## Deployment Best Practices

**Before Deploying:**
- Always run `npm run build:combustibles` locally to verify builds work
- Check that all tests pass: `npm run test --workspace=combustibles`
- Verify linting: `npm run lint:combustibles`
- Test critical user flows in development environment

**Deployment Methods:**
1. **Quick Manual Deploy** (Recommended for development):
   - Go to GitHub Actions → "🚀 Forestech Manual Deploy TURBO"
   - Click "Run workflow"
   - Select target app (all, combustibles, or alimentacion)

2. **Versioned Release Deploy** (Recommended for production):
   ```bash
   git tag -a v1.0.1 -m "Release: Fix HourMeterDisplay error"
   git push origin v1.0.1
   ```

3. **Local Deploy** (For testing):
   ```bash
   npm run deploy  # Full deployment with tests
   ```

**Post-Deployment:**
- Monitor application logs in Firebase console
- Check that WebAuthn passkeys still work correctly
- Verify SSR is functioning (check page source for dynamic content)
- Test on mobile devices if critical changes were made

When working with this codebase, prioritize Firebase integration patterns, maintain SSR compatibility, and follow the established context/service architecture.


