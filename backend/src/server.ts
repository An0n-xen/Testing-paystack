// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import paymentRoutes from './routes/payment.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Payment routes
app.use('/api/payment', paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════════════════');
  console.log('   PAYSTACK PAYMENT SERVER');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`   📡 Server running on http://localhost:${PORT}`);
  console.log(`   🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('   POST /api/payment/initialize-popup    - Initialize popup payment');
  console.log('   POST /api/payment/initialize-redirect - Initialize redirect payment');
  console.log('   GET  /api/payment/verify/:reference   - Verify transaction');
  console.log('   POST /api/payment/webhook             - Webhook endpoint');
  console.log('   GET  /api/payment/transactions        - List verified transactions');
  console.log('');
});
