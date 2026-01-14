# 🔐 Using Docker with Environment Variables

## Quick Setup (Recommended)

### Step 1: Create Root .env File

Create a `.env` file in the **root directory** (not in backend or frontend):

```bash
# .env (root directory)
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key
```

### Step 2: Run Docker Compose

```bash
docker-compose up --build
```

That's it! Docker Compose will:
- Read the `.env` file from the root directory
- Pass the variables to both containers
- Build the frontend with the public key baked in

---

## How It Works

### Frontend (Next.js)
- Uses **build args** to inject `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` at build time
- Also sets it as runtime environment variable
- This is required because Next.js needs public env vars at build time

### Backend (Express)
- Reads `PAYSTACK_SECRET_KEY` from environment variable OR Docker secret
- Supports both methods for flexibility

---

## Using Docker Secrets (More Secure)

For production or when you want extra security:

### Step 1: Create Secret File

```bash
# Create secrets directory (already exists)
echo "sk_test_your_actual_secret_key" > secrets/paystack_secret_key.txt
```

### Step 2: Update .env

```bash
# .env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key
# Note: PAYSTACK_SECRET_KEY is now in secrets file
```

### Step 3: Run with Secrets

```bash
docker-compose up --build
```

The backend will automatically detect and use the Docker secret!

---

## Troubleshooting

### "Paystack public key is not configured"

**Problem**: Frontend can't read the public key

**Solution**:
1. Ensure `.env` file exists in **root directory** (not frontend/.env.local)
2. Check the file contains: `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...`
3. Rebuild containers: `docker-compose up --build`

### "Invalid key" error from backend

**Problem**: Backend secret key is wrong or not loaded

**Solutions**:
1. Check `.env` has correct `PAYSTACK_SECRET_KEY=sk_test_...`
2. OR create `secrets/paystack_secret_key.txt` with your key
3. Restart: `docker-compose restart backend`

### Environment variables not updating

**Problem**: Changed .env but nothing happened

**Solution**:
- Must rebuild for frontend: `docker-compose up --build`
- Can just restart for backend: `docker-compose restart backend`

---

## File Structure for Docker

```
Testing-paystack/
├── .env                          # ← Main env file (Docker Compose reads this)
│   ├── PAYSTACK_SECRET_KEY
│   └── NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
│
├── secrets/                      # ← Docker secrets (optional, more secure)
│   └── paystack_secret_key.txt   # ← Backend secret key
│
├── backend/
│   ├── .env                      # ← Not used by Docker, only for local dev
│   └── server.js                 # ← Reads from Docker secret OR env var
│
└── frontend/
    └── .env.local                # ← Not used by Docker, only for local dev
```

---

## Commands Cheat Sheet

```bash
# Start with environment variables
docker-compose up --build

# Start in background
docker-compose up -d --build

# Check if env vars are loaded
docker-compose exec backend env | grep PAYSTACK
docker-compose exec frontend env | grep NEXT_PUBLIC

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart after changing backend .env
docker-compose restart backend

# Rebuild after changing frontend .env
docker-compose up --build

# Stop everything
docker-compose down
```

---

## Best Practices

✅ **Development**: Use `.env` file in root directory  
✅ **Production**: Use Docker secrets for sensitive keys  
✅ **Never commit**: .env files or secrets/ directory  
✅ **Always rebuild**: Frontend after changing NEXT_PUBLIC_* vars  
✅ **Can restart**: Backend after changing secret key  

---

## Why This Approach?

1. **Single .env file** - Easier to manage, one place for all keys
2. **Build-time injection** - Next.js public vars work correctly
3. **Secrets support** - Production-ready security
4. **Backward compatible** - Works with local dev too
5. **Auto-detection** - Backend tries secrets first, then env vars
