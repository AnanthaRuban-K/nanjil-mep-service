FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy backend's package files from the correct path
COPY apps/backend/package.json apps/backend/package-lock.json* ./

# Install dependencies
RUN npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy node_modules
COPY --from=deps /app/node_modules ./node_modules

# Copy backend files
COPY apps/backend ./

# Build
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy built files
COPY --from=builder --chown=hono:nodejs /app/dist ./dist
COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules

USER hono

EXPOSE 3101

CMD ["node", "dist/main.js"]