FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy backend package files
COPY apps/backend/package*.json ./apps/backend/

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy all source code
COPY . .

# Build the backend
RUN cd apps/backend && npm run build

# Expose port
EXPOSE 3000

# Start the backend
CMD ["node", "apps/backend/dist/main.js"]