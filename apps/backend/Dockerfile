FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy entire monorepo
COPY . .

# Build the backend using Nx
RUN npx nx build backend

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create app user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy built application
COPY --from=builder --chown=hono:nodejs /app/dist/apps/backend ./
COPY --from=builder --chown=hono:nodejs /app/node_modules ./node_modules

USER hono

EXPOSE 3101

CMD ["node", "main.js"]