# Performance & Code Splitting Guide

Key decisions and patterns implemented during Phase 3.

## Code splitting
- Route-based lazy imports (App.jsx)
- Lazy heavy modals/wizards (InventoryModal, MovementWizard, VehicleFormSmart, MaintenanceModal)
- Manual chunks for vendor/ui/firebase/auth/db

## Critical CSS
- Inline above-the-fold styles for Auth/Dashboard/Modals
- Explicit dimensions to prevent CLS

## Firebase
- Modular imports, split core/auth/db
- Lazy-load non-critical contexts

## Resource hints
- dns-prefetch/preconnect to Google/Firebase domains
- Preload critical background image

## Web Vitals
- Web Vitals logging in dev via src/utils/webVitals.js
- Targets: LCP < 2.5s, CLS < 0.1, FCP < 3.4s
