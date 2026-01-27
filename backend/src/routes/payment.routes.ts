import { Router, Request, Response } from 'express';
import { paystackService, TransactionParams } from '../services/paystack.service';

const router = Router();

// In-memory transaction storage (for demo purposes)
const transactions: Map<string, object> = new Map();

/**
 * Initialize transaction for Popup payment
 * POST /api/payment/initialize-popup
 */
router.post('/initialize-popup', async (req: Request, res: Response) => {
  try {
    const { email, amount, metadata } = req.body;

    if (!email || !amount) {
      res.status(400).json({
        success: false,
        message: 'Email and amount are required',
      });
      return;
    }

    const params: TransactionParams = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo/pesewas
      metadata,
    };

    const data = await paystackService.initializeTransaction(params);

    console.log(`✅ Popup transaction initialized: ${data.reference}`);

    res.json({
      success: true,
      data: {
        access_code: data.access_code,
        reference: data.reference,
      },
    });
  } catch (error) {
    console.error('❌ Popup initialization error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize transaction',
    });
  }
});

/**
 * Initialize transaction for Redirect payment
 * POST /api/payment/initialize-redirect
 */
router.post('/initialize-redirect', async (req: Request, res: Response) => {
  try {
    const { email, amount, callback_url, metadata } = req.body;

    if (!email || !amount) {
      res.status(400).json({
        success: false,
        message: 'Email and amount are required',
      });
      return;
    }

    const params: TransactionParams = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo/pesewas
      callback_url,
      metadata,
    };

    const data = await paystackService.initializeTransaction(params);

    console.log(`✅ Redirect transaction initialized: ${data.reference}`);

    res.json({
      success: true,
      data: {
        authorization_url: data.authorization_url,
        reference: data.reference,
      },
    });
  } catch (error) {
    console.error('❌ Redirect initialization error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize transaction',
    });
  }
});

/**
 * Verify transaction by reference
 * GET /api/payment/verify/:reference
 */
router.get('/verify/:reference', async (req: Request, res: Response) => {
  try {
    const reference = req.params.reference as string;

    const data = await paystackService.verifyTransaction(reference);

    console.log(`🔍 Transaction verified: ${reference} - Status: ${data.status}`);

    res.json({
      success: true,
      data: {
        status: data.status,
        reference: data.reference,
        amount: data.amount / 100, // Convert back to main currency unit
        currency: data.currency,
        customer_email: data.customer.email,
        paid_at: data.paid_at,
        channel: data.channel,
        gateway_response: data.gateway_response,
      },
    });
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify transaction',
    });
  }
});

/**
 * Webhook endpoint for Paystack events
 * POST /api/payment/webhook
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Validate webhook signature
    if (!paystackService.validateWebhookSignature(payload, signature)) {
      console.warn('⚠️  Invalid webhook signature');
      res.status(401).json({ message: 'Invalid signature' });
      return;
    }

    const event = req.body;

    console.log('📨 Webhook received:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        const { reference, amount, customer, status } = event.data;
        console.log(`💰 Payment successful!`);
        console.log(`   Reference: ${reference}`);
        console.log(`   Amount: ${amount / 100}`);
        console.log(`   Customer: ${customer.email}`);
        console.log(`   Status: ${status}`);

        // Store transaction (in production, save to database)
        transactions.set(reference, {
          reference,
          amount: amount / 100,
          customer_email: customer.email,
          status,
          verified_at: new Date().toISOString(),
        });
        break;

      case 'charge.failed':
        console.log(`❌ Payment failed: ${event.data.reference}`);
        break;

      default:
        console.log(`📌 Unhandled event: ${event.event}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    // Still return 200 to prevent Paystack from retrying
    res.status(200).json({ received: true });
  }
});

/**
 * Get all stored transactions (for demo purposes)
 * GET /api/payment/transactions
 */
router.get('/transactions', (req: Request, res: Response) => {
  const allTransactions = Array.from(transactions.values());
  res.json({
    success: true,
    data: allTransactions,
  });
});

export default router;
