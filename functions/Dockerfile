FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies (fallback to install if ci fails)
RUN npm ci --only=production --no-audit --no-fund || npm install --only=production --no-audit --no-fund
RUN npm cache clean --force

# Copy application code
COPY server.js ./
COPY src ./src

EXPOSE 8080

CMD ["node", "server.js"]