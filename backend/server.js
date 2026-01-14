require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Function to get secret key (supports both env var and Docker secrets)
function getPaystackSecretKey() {
  //Try Docker secret first (for production)
  const secretPath = '/run/secrets/paystack_secret_key';
  try {
    if (fs.existsSync(secretPath) && fs.statSync(secretPath).isFile()) {
      console.log('Using Paystack secret key from Docker secret');
      return fs.readFileSync(secretPath, 'utf8').trim();
    }
  } catch (err) {
    // Docker secret not available, fall through to env var
    console.log('Docker secret not available, using environment variable');
  }
  
  // Fall back to environment variable (for development)
  if (process.env.PAYSTACK_SECRET_KEY) {
    console.log('Using Paystack secret key from environment variable');
    return process.env.PAYSTACK_SECRET_KEY;
  }
  
  throw new Error('PAYSTACK_SECRET_KEY not found in environment or Docker secrets');
}

// Paystack configuration
const PAYSTACK_SECRET_KEY = getPaystackSecretKey();
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize payment endpoint
app.post('/api/payment/initialize', async (req, res) => {
  try {
    const { email, amount } = req.body;

    // Validate input
    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Email and amount are required'
      });
    }

    // Initialize transaction with Paystack
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert to pesewas (smallest currency unit)
        currency: 'GHS',
        callback_url: `${req.body.callback_url || 'http://localhost:3000/success'}`
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Payment initialization error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.response?.data || error.message
    });
  }
});

// Verify payment endpoint
app.get('/api/payment/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    // Verify transaction with Paystack
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.response?.data || error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Paystack backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
