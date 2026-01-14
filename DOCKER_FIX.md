# 🔧 Docker Fix - Quick Start Guide

## The Problem

You got the error **"Paystack public key is not configured"** because Docker couldn't read the environment variables from the separate `.env` files.

## The Solution ✅

I've made the following changes:

### 1. Updated `docker-compose.yml`
- Now uses **build args** to inject `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` at build time (required for Next.js)
- Reads variables from a single **root `.env` file**
- Added **Docker secrets** support for the backend

### 2. Updated `frontend/Dockerfile`  
- Accepts build arguments for Next.js public environment variables
- Sets them at build time so they're baked into the frontend

### 3. Updated `backend/server.js`
- Now supports **both** environment variables AND Docker secrets
- Automatically tries Docker secret first, falls back to env var
- More secure for production deployments

### 4. Created Root `.env` File
- Single `.env` file in the root directory
- Docker Compose reads this and passes to containers

---

## ⚡ Quick Fix Steps

### Step 1: Add Your Public Key

Edit the **root** `.env` file (the one I just created in the main directory):

```bash
# .env (in root directory)
PAYSTACK_SECRET_KEY=sk_test_97dd58240bb3d50c61b959e7c93e99a44bd98477
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_ACTUAL_PUBLIC_KEY_HERE  # ← ADD THIS
```

You need to add your Paystack **public key** (starts with `pk_test_`)

### Step 2: Rebuild and Start

```bash
docker-compose down
docker-compose up --build
```

The `--build` flag is **required** to rebuild the frontend with the new public key!

---

## 📁 File Structure (Important!)

```
Testing-paystack/
├── .env                    # ← NEW! Docker Compose reads THIS
│   ├── PAYSTACK_SECRET_KEY=sk_test_...
│   └── NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
│
├── backend/
│   └── .env               # ← Only for LOCAL development (yarn start)
│
└── frontend/
    └── .env.local         # ← Only for LOCAL development (yarn dev)
```

**Key Point**: Docker uses the **root .env file**, not the ones in backend/frontend folders!

---

## 🐳 Using Docker Secrets (Optional - More Secure)

If you want to use Docker secrets for your backend key:

### Step 1: Create Secret File

```bash
mkdir secrets
echo "sk_test_97dd58240bb3d50c61b959e7c93e99a44bd98477" > secrets/paystack_secret_key.txt
```

### Step 2: Update Root `.env`

```bash
# .env
# Backend will use Docker secret, so you can remove or comment this line:
# PAYSTACK_SECRET_KEY=sk_test_...

# Frontend still needs this in .env:
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

### Step 3: Restart

```bash
docker-compose down
docker-compose up --build
```

The backend will automatically detect and use the Docker secret!

---

## ✅ Verify It's Working

### Check Environment Variables

```bash
# Check backend has the secret key
docker-compose exec backend env | grep PAYSTACK

# Check frontend has the public key
docker-compose exec frontend env | grep NEXT_PUBLIC
```

### View Logs

```bash
# Backend logs (should say "Using Paystack secret key from...")
docker-compose logs backend

# Frontend logs
docker-compose logs frontend
```

---

## 🎯 Commands Reference

```bash
# Stop everything
docker-compose down

# Start with rebuild (REQUIRED after changing .env)
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Restart just one service
docker-compose restart backend
docker-compose restart frontend
```

---

## 📚 More Information

See the comprehensive guide: **DOCKER_ENV_GUIDE.md**

---

## ❓ Still Having Issues?

### Error: "Paystack public key is not configured"
- Ensure `.env` exists in **root directory**
- Check it contains `NEXT PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...`
- **Must rebuild**: `docker-compose up --build`

### Error: "Invalid key" 
- Check root `.env` has `PAYSTACK_SECRET_KEY=sk_test_...`
- OR create `secrets/paystack_secret_key.txt` with your secret key
- Restart: `docker-compose restart backend`

---

That's it! Just add your public key to the root `.env` file and rebuild! 🚀
