'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function Success() {
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');

      if (!reference) {
        setError('No payment reference found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/payment/verify/${reference}`);

        if (response.data.success) {
          setTransaction(response.data.data);
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container">
        <div className="success-container">
          <h1>⏳ Verifying Payment...</h1>
          <p className="subtitle">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="success-container">
          <h1>❌ Verification Failed</h1>
          <div className="error-message">{error}</div>
          <button className="back-button" onClick={() => window.location.href = '/'}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Payment Successful!</h1>
        <p className="subtitle">Your transaction has been completed successfully</p>

        {transaction && (
          <div className="transaction-details">
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">
                GHS ₵{(transaction.amount / 100).toFixed(2)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Reference:</span>
              <span className="detail-value">{transaction.reference}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value" style={{ color: '#11998e' }}>
                {transaction.status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{transaction.customer.email}</span>
            </div>
            {transaction.channel && (
              <div className="detail-row">
                <span className="detail-label">Payment Method:</span>
                <span className="detail-value">{transaction.channel}</span>
              </div>
            )}
          </div>
        )}

        <button className="back-button" onClick={() => window.location.href = '/'}>
          Make Another Payment
        </button>
      </div>
    </div>
  );
}
