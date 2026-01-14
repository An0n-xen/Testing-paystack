# 💳 Paystack Payment Testing Application

A simple application to test Paystack payment integration with Next.js frontend and Express backend using **GHS (Ghana Cedis)** currency.

## 🚀 Features

- ✅ Payment initialization with Paystack API
- ✅ Secure payment processing in GHS
- ✅ Transaction verification
- ✅ Modern, responsive UI with animations
- ✅ Error handling and validation
- ✅ Test mode for safe testing

## 📋 Prerequisites

**For Docker deployment (Recommended):**
- Docker Desktop or Docker Engine
- Docker Compose

**For local development:**
- Node.js (v18 or higher)
- Yarn package manager

**For both:**
- Paystack account ([Sign up here](https://paystack.com))

## ⚡ Quick Start

### Option 1: Docker (Recommended for portability)

1. Ensure Docker and Docker Compose are installed
2. Add your Paystack API keys to the `.env` files:
   - `backend/.env` - Add your secret key
   - `frontend/.env.local` - Add your public key
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Open `http://localhost:3030` in your browser
5. Use test card: `4084084084084081` | CVV: `408` | PIN: `0000` | OTP: `123456`

To stop the containers:
```bash
docker-compose down
```

### Option 2: Local Development

1. Add your Paystack API keys to the `.env` files (see setup instructions below)
2. Run the startup script:
   ```powershell
   .\start.ps1
   ```
3. Open `http://localhost:3030` in your browser
4. Use test card: `4084084084084081` | CVV: `408` | PIN: `0000` | OTP: `123456`

## 🔧 Setup Instructions

### 1. Get Paystack API Keys

1. Sign up or log in to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy your **Test Public Key** and **Test Secret Key**

### 2. Backend Setup

```bash
cd backend
yarn install
```

Create a `.env` file in the `backend` directory:

```env
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PORT=5000
```

Start the backend server:

```bash
yarn start
```

Or for development with auto-reload:

```bash
yarn dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
yarn install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
yarn dev
```

The frontend will run on `http://localhost:3030`

## 🧪 Testing the Application

1. Open your browser and navigate to `http://localhost:3030`
2. Fill in the payment form:
   - **Email**: Any valid email address
   - **Amount**: Any amount in GHS (e.g., 10.00)
3. Click "Pay Now"
4. Use Paystack test card details:
   - **Card Number**: `4084084084084081`
   - **CVV**: `408`
   - **Expiry**: Any future date
   - **PIN**: `0000`
   - **OTP**: `123456`
5. Complete the payment
6. You'll be redirected to the success page with transaction details

## 🗂️ Project Structure

```
Testing-paystack/
├── backend/
│   ├── server.js           # Express server with Paystack endpoints
│   ├── package.json        # Backend dependencies
│   ├── Dockerfile          # Backend Docker image
│   ├── .dockerignore       # Docker ignore file
│   ├── .env.example        # Environment variables template
│   └── .gitignore
│
├── frontend/
│   ├── app/
│   │   ├── page.js         # Main payment form
│   │   ├── success/
│   │   │   └── page.js     # Success page with verification
│   │   ├── layout.js       # Root layout
│   │   └── globals.css     # Global styles
│   ├── package.json        # Frontend dependencies
│   ├── Dockerfile          # Frontend Docker image
│   ├── .dockerignore       # Docker ignore file
│   ├── .env.local.example  # Environment variables template
│   └── .gitignore
│
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore           # Root Docker ignore file
├── start.ps1               # PowerShell startup script
└── README.md
```

## 📡 API Endpoints

### Backend (http://localhost:5000)

#### POST `/api/payment/initialize`
Initialize a payment transaction

**Request Body:**
```json
{
  "email": "customer@example.com",
  "amount": 10.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "...",
    "reference": "..."
  }
}
```

#### GET `/api/payment/verify/:reference`
Verify a payment transaction

**Response:**
```json
{
  "success": true,
  "data": {
    "amount": 1000,
    "currency": "GHS",
    "status": "success",
    "reference": "...",
    "customer": {
      "email": "customer@example.com"
    }
  }
}
```

#### GET `/health`
Health check endpoint

## 🎨 UI Features

- Modern gradient design
- Smooth animations
- Responsive layout
- Form validation
- Error handling
- Loading states
- Transaction details display

## 🔒 Security Notes

- Never commit `.env` or `.env.local` files
- Use test API keys for development
- Switch to live keys only in production
- Validate all inputs on the backend
- Always verify payments on the backend

## 📚 Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [Docker Deployment Guide](./DOCKER.md)
- [Docker Setup Summary](./DOCKER_SETUP.md)

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists and contains valid keys

### Frontend won't start
- Check if port 3030 is available
- Verify `.env.local` file exists
- Run `yarn install` again

### Payment initialization fails
- Verify Paystack secret key is correct
- Check backend console for errors
- Ensure backend is running

### Payment verification fails
- Check if the reference parameter is passed correctly
- Verify network connectivity
- Check Paystack dashboard for transaction status

### Docker containers won't start
- Ensure Docker Desktop is running
- Check if ports 3030 and 5000 are available
- Verify `.env` files exist in both backend and frontend directories
- Try rebuilding: `docker-compose up --build --force-recreate`
- Check container logs: `docker-compose logs backend` or `docker-compose logs frontend`

### Docker build fails
- Clear Docker cache: `docker system prune -a`
- Ensure `yarn.lock` files exist in both directories
- Check Dockerfile syntax

## 📝 License

MIT

## 👨‍💻 Author

Built for testing Paystack payment integration with GHS currency.
