FROM node:20-alpine

WORKDIR /app

# Copy all package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/

# Install root dependencies
RUN npm install

# Install workspace dependencies
RUN cd apps/backend && npm install
RUN cd apps/frontend && npm install

# Copy all source code
COPY . .

# Build the backend
RUN cd apps/backend && npm run build

# Expose port
EXPOSE 3100

# Start the backend
CMD ["node", "apps/backend/dist/main.js"]