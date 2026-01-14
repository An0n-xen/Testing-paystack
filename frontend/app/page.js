'use client';

import { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import axios from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Log the API URL on component load (for debugging)
  console.log('🔧 API Configuration:', {
    API_URL: API_URL,
    ENV_VALUE: process.env.NEXT_PUBLIC_API_URL,
    IS_DEFAULT: !process.env.NEXT_PUBLIC_API_URL
  });

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    const requestUrl = `${API_URL}/api/payment/initialize`;
    const requestBody = {
      email,
      amount: parseFloat(amount),
      callback_url: `${window.location.origin}/success`
    };

    console.log('📤 Payment Request:', {
      url: requestUrl,
      body: requestBody,
      origin: window.location.origin
    });

    try {
      // Initialize payment with backend
      const response = await axios.post(requestUrl, requestBody);

      console.log('✅ Payment Response:', response.data);

      if (response.data.success) {
        const { authorization_url, reference } = response.data.data;
        console.log('🔗 Redirecting to:', authorization_url);
        
        // Redirect to Paystack payment page
        window.location.href = authorization_url;
      } else {
        setError('Failed to initialize payment');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Payment error:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        requestUrl: requestUrl
      });
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>💳 Paystack Payment</h1>
      <p className="subtitle">Test payment integration with GHS</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handlePayment}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            Amount <span className="currency-symbol">(GHS ₵)</span>
          </label>
          <input
            type="number"
            id="amount"
            placeholder="10.00"
            step="0.01"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '⏳ Processing...' : '💸 Pay Now'}
        </button>
      </form>

      <p className="subtitle" style={{ marginTop: '20px' }}>
        Test Card: 4084084084084081 | CVV: 408 | Expiry: Any future date
      </p>
    </div>
  );
}
