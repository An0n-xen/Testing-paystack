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

- Node.js (v18 or higher)
- Yarn package manager
- Paystack account ([Sign up here](https://paystack.com))

## ⚡ Quick Start

1. Add your Paystack API keys to the `.env` files (see setup instructions below)
2. Run the startup script:
   ```powershell
   .\start.ps1
   ```
3. Open `http://localhost:3000` in your browser
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

The frontend will run on `http://localhost:3000`

## 🧪 Testing the Application

1. Open your browser and navigate to `http://localhost:3000`
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
│   ├── .env.local.example  # Environment variables template
│   └── .gitignore
│
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

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists and contains valid keys

### Frontend won't start
- Check if port 3000 is available
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

## 📝 License

MIT

## 👨‍💻 Author

Built for testing Paystack payment integration with GHS currency.
