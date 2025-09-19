# AGENTS.md - Code Guidelines for AI Agents

## Build/Lint/Test Commands
- **Build**: `npm run build:all` (both apps), `npm run build:combustibles` (single app)
- **Dev**: `npm run dev:combustibles` (port 5174), `npm run dev:alimentacion` (port 5173)
- **Lint**: `npm run lint:all`, `npm run lint:combustibles --if-present`
- **Test Single**: `npm run test --workspace=combustibles`, `vitest run src/specific.test.js`
- **E2E**: `npm run e2e:movement-flow`, `npm run e2e:smoke --project=chromium`
- **Deploy**: `npm run deploy` (full), GitHub Actions "🚀 Forestech Manual Deploy TURBO"

## Code Style Guidelines
- **Files**: Components `PascalCase.jsx`, services `camelCase.js`, contexts `NameContext.jsx`
- **Imports**: Firebase first, React hooks, local components, utilities last
- **Spacing**: 2 spaces for React/JS, no trailing spaces
- **Variables**: `camelCase` for vars, `PascalCase` components, `SCREAMING_SNAKE_CASE` constants
- **Error Handling**: Always try/catch Firebase ops with loading states and console.error
- **Hooks**: `useCallback` for functions, `useMemo` for expensive calculations
- **Types**: JSDoc comments for complex functions, PropTypes for components
- **Permissions**: Validate with `user?.combustiblesPermissions?.[action] === true`
- **Console**: Use descriptive prefixes (`🔥 Firebase:`, `👤 Auth:`, `📊 Movement:`)
- **Firebase**: Use shared config from `/shared/firebase/`, follow service pattern
- **Contexts**: Create SSR variants with `ContextNameSSR.jsx` for server-side rendering