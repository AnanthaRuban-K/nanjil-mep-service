FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app



# Install all dependencies
RUN npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the entire monorepo
COPY . .

# Build the frontend using Nx
RUN npx nx build frontend --prod

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from the Nx output directory
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/frontend/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dist/apps/frontend/static ./apps/frontend/.next/static

USER nextjs

EXPOSE 3100

ENV PORT=3100
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "apps/frontend/server.js"]