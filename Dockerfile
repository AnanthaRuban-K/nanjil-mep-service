FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build backend
RUN cd apps/backend && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy necessary files
COPY --from=base /app/package*.json ./
COPY --from=base /app/apps/backend/package*.json ./apps/backend/
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/node_modules ./apps/backend/node_modules

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["npm", "start"]