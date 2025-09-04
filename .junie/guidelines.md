# Project Guidelines - Forestech Colombia

## Project Overview

Forestech Colombia is a Firebase-based monorepo containing two main web applications:

- **Alimentacion**: React/Vite application for food-related services
- **Combustibles**: React/Vite application for fuel management with SSR capabilities

The project uses modern JavaScript tooling and Firebase services including Hosting, Functions, Firestore, and Storage.

## Project Structure

```
forestech/
├── alimentacion/          # Food application workspace (React/Vite)
├── combustibles/          # Fuel application workspace (React/Vite)
├── functions/             # Firebase Functions (Node.js backend)
│   ├── ssr/              # Server-side rendering logic
│   └── webhooks/         # Webhook handlers
├── public/               # Static assets and hosting files
├── scripts/              # Build and deployment automation scripts
├── shared/               # Shared utilities and components
└── tests-e2e/           # End-to-end tests
```

## Development Workflow

### Building the Project

- Use `npm run build:all` to build both applications
- Use `npm run build:parallel` for faster parallel builds
- Use `npm run build:incremental` for smart incremental builds
- Individual builds: `npm run build:alimentacion` or `npm run build:combustibles`

### Testing Strategy

- Tests are primarily delegated to GitHub Actions CI/CD
- Run `npm run test:ci` to execute workspace-specific tests
- E2E tests available in `tests-e2e/` directory
- Use `npm run test:ssr-validation` for SSR testing

### Code Quality

- ESLint configuration per workspace with React-specific rules
- Prettier for code formatting with Tailwind CSS plugin
- Husky git hooks with lint-staged for pre-commit checks
- Commitlint for conventional commit message validation

### Deployment

- Use `npm run deploy` for full deployment to Firebase
- Use `npm run deploy:smart` for optimized deployments
- Functions deployed separately with `npm run deploy:ssr`
- Performance monitoring with `npm run perf:budget`

## Instructions for Junie

### Testing Requirements

- Always run relevant tests after making changes using `npm run test:ci`
- For SSR-related changes, run `npm run test:ssr-validation`
- Run linting with `npm run lint:check` before submitting

### Build Requirements

- Build the project using `npm run build:incremental` for faster feedback
- For major changes affecting both apps, use `npm run build:all`
- Check performance impact with `npm run perf:budget` for frontend changes

### Code Style

- Follow existing ESLint and Prettier configurations
- Use conventional commit messages (enforced by commitlint)
- Maintain workspace separation - avoid cross-workspace dependencies
- Use shared utilities in `/shared` for common code

### Firebase-Specific Considerations

- Functions code goes in `/functions` directory
- Frontend routing handled by Firebase Hosting rewrites
- SSR implementation exists for combustibles app via `ssrCombustibles` function
- Environment variables managed through `.env` files in functions/

### Performance & Monitoring

- Monitor bundle sizes and performance budgets
- Use incremental builds and smart deployment scripts
- Leverage Firebase's caching and CDN capabilities
