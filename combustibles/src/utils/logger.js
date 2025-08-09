// utils/logger.js - Logger ligero y estructurado (dev-friendly)
const isDev = import.meta.env.MODE === 'development';

const base = (level, message, data) => {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg: message,
    ...((data && typeof data === 'object') ? { data } : {}),
  };
  if (isDev) {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[${entry.level.toUpperCase()}] ${entry.ts} ${entry.msg}`,
      entry.data || ''
    );
  }
  return entry;
};

export const logger = {
  info: (message, data) => base('info', message, data),
  warn: (message, data) => base('warn', message, data),
  error: (message, data) => base('error', message, data),
  performance: (name, duration, extra) =>
    base(duration > 1000 ? 'warn' : 'info', `Perf ${name}: ${duration.toFixed(2)}ms`, extra),
};

export default logger;
