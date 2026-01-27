import crypto from 'crypto';

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface InitializeTransactionData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface VerifyTransactionData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  customer: {
    id: number;
    email: string;
  };
  metadata: Record<string, unknown>;
}

export interface TransactionParams {
  email: string;
  amount: number; // Amount in kobo (NGN) or pesewas (GHS)
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

class PaystackService {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    if (!this.secretKey) {
      console.warn('⚠️  PAYSTACK_SECRET_KEY is not set in environment variables');
    }
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: object
  ): Promise<PaystackResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json() as { message?: string };
      throw new Error(errorData.message || 'Paystack API request failed');
    }

    return response.json() as Promise<PaystackResponse<T>>;
  }

  /**
   * Initialize a transaction
   * Returns access_code for popup and authorization_url for redirect
   */
  async initializeTransaction(params: TransactionParams): Promise<InitializeTransactionData> {
    const response = await this.request<InitializeTransactionData>(
      '/transaction/initialize',
      'POST',
      {
        email: params.email,
        amount: params.amount,
        callback_url: params.callback_url,
        metadata: params.metadata,
      }
    );

    return response.data;
  }

  /**
   * Verify a transaction by its reference
   */
  async verifyTransaction(reference: string): Promise<VerifyTransactionData> {
    const response = await this.request<VerifyTransactionData>(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );

    return response.data;
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(payload)
      .digest('hex');

    return hash === signature;
  }
}

export const paystackService = new PaystackService();
