import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add global IS_REACT_ACT_ENVIRONMENT for React 18+
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

