# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production deps only
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
