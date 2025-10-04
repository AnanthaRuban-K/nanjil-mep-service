FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install backend dependencies
COPY apps/backend/package*.json ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
WORKDIR /app

# Copy source code
COPY apps/backend ./
COPY package*.json ./
RUN npm ci

# Build the backend
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create app user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy built application
COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=deps --chown=hono:nodejs /app/node_modules ./node_modules

USER hono

EXPOSE 3101

CMD ["node", "dist/main.js"]