# GitHub Copilot Instructions

This file provides guidance for AI coding agents working with the Forestech monorepo - a Firebase-hosted suite of React web applications for Colombian forestry operations.

## Project Architecture

**Monorepo Structure:**
- `alimentacion/` - Food/meal liquidations React app
- `combustibles/` - Fuel management React app with WebAuthn passkey authentication
- `shared/` - Shared Firebase configuration, styles, and constants
- `functions/` - Firebase Functions for SSR and webhooks
- `scripts/` - Unified deployment and build automation

**Key Technology Stack:**
- React 19 + Vite for both apps
- Firebase (Auth, Firestore, Hosting, Functions)
- WebAuthn (passkeys) via Firebase extension for `combustibles`
- Tailwind CSS + React Aria Components (combustibles)
- SSR support for SEO optimization

## Critical Development Workflows

**Primary Commands:**
```bash
npm run deploy           # Full deployment with tests + lint (RECOMMENDED)
npm run dev:combustibles # Development server on port 5174
npm run dev:alimentacion # Development server on port 5173
npm run build:all        # Build both apps to public/ directories
```

**Deployment Flow:**
1. `scripts/deploy-forestech.sh` - Unified 40-60 second deploy script
2. Auto-builds to `public/combustibles/` and `public/alimentacion/`
3. Firebase hosting serves from single project with path routing
4. GitHub Actions handles production deployments on main branch pushes

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

When working with this codebase, prioritize Firebase integration patterns, maintain SSR compatibility, and follow the established context/service architecture.


