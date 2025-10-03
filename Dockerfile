FROM node:20-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install all dependencies including devDependencies
RUN npm install --include=dev

# Verify TypeScript is installed
RUN npx tsc --version

# Build the backend
RUN cd apps/backend && npm run build

# Expose port
EXPOSE 3000

# Start the backend
CMD ["node", "apps/backend/dist/main.js"]