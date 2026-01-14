# Docker Deployment Guide

## Quick Start with Docker

The easiest way to run this application anywhere is using Docker:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Testing-paystack

# 2. Configure environment variables
# Edit backend/.env with your Paystack secret key
# Edit frontend/.env.local with your Paystack public key

# 3. Start with Docker Compose
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3030
- Backend API: http://localhost:5000

## Docker Commands

### Start the application
```bash
docker-compose up
```

### Start in detached mode (background)
```bash
docker-compose up -d
```

### Rebuild and start
```bash
docker-compose up --build
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

### Restart services
```bash
docker-compose restart
```

### Remove containers and volumes
```bash
docker-compose down -v
```

## Architecture

![Docker Architecture](../../../.gemini/antigravity/brain/468239b2-a604-4686-a4a2-6be9385d3d39/docker_architecture_1768382834499.png)

The Docker setup includes:

- **Backend Container**: Node.js 18 Alpine running Express server on port 5000
- **Frontend Container**: Node.js 18 Alpine running Next.js dev server on port 3000
- **Network**: Both containers on a shared bridge network for communication
- **Environment**: Environment variables loaded from .env files

## Deployment to Production

For production deployment, consider:

1. **Using Production Dockerfile for Frontend**:
   ```dockerfile
   # Add to frontend/Dockerfile.prod
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package.json yarn.lock ./
   RUN yarn install --frozen-lockfile
   COPY . .
   RUN yarn build

   FROM node:18-alpine AS runner
   WORKDIR /app
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json
   EXPOSE 3000
   CMD ["yarn", "start"]
   ```

2. **Update docker-compose for production**:
   - Use production Dockerfiles
   - Set NODE_ENV=production
   - Use secrets management for API keys
   - Add health checks
   - Configure restart policies

3. **Security considerations**:
   - Never commit .env files
   - Use Docker secrets or environment variables in CI/CD
   - Run containers as non-root user
   - Keep base images updated

## Troubleshooting

### Containers won't start
- Ensure Docker Desktop is running
- Check ports 3000 and 5000 are not in use: `netstat -ano | findstr :3000`
- Verify .env files exist

### Application not accessible
- Check container status: `docker-compose ps`
- Verify port mappings: `docker-compose port frontend 3000`
- Check firewall settings

### Build errors
- Clear Docker cache: `docker system prune -a`
- Remove existing images: `docker-compose down --rmi all`
- Rebuild: `docker-compose up --build --force-recreate`

### Environment variables not working
- Ensure .env files are in correct locations
- Restart containers after changing .env: `docker-compose restart`
- Check env vars inside container: `docker-compose exec backend env`
