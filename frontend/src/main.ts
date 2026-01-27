import './style.css';

// Configuration - uses Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.41.246.221:3000/api/payment';

// Extend Window interface for Paystack
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
      new (): {
        resumeTransaction: (accessCode: string, config?: PaystackResumeConfig) => void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  onSuccess: (response: PaystackResponse) => void;
  onCancel: () => void;
  onClose?: () => void;
}

interface PaystackResumeConfig {
  onSuccess: (response: PaystackResponse) => void;
  onCancel: () => void;
}

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
  message?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface InitializePopupData {
  access_code: string;
  reference: string;
}

interface InitializeRedirectData {
  authorization_url: string;
  reference: string;
}

interface VerifyData {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  customer_email: string;
  paid_at: string;
  channel: string;
  gateway_response: string;
}

// DOM Elements
const paymentForm = document.getElementById('payment-form') as HTMLFormElement;
const paymentCard = document.querySelector('.payment-card') as HTMLDivElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const amountInput = document.getElementById('amount') as HTMLInputElement;
const popupBtn = document.getElementById('popup-btn') as HTMLButtonElement;
const redirectBtn = document.getElementById('redirect-btn') as HTMLButtonElement;
const loadingOverlay = document.getElementById('loading-overlay') as HTMLDivElement;
const statusCard = document.getElementById('status-card') as HTMLDivElement;
const statusIcon = document.getElementById('status-icon') as HTMLDivElement;
const statusTitle = document.getElementById('status-title') as HTMLHeadingElement;
const statusMessage = document.getElementById('status-message') as HTMLParagraphElement;
const transactionDetails = document.getElementById('transaction-details') as HTMLDivElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;

// Utility Functions
function showLoading(): void {
  loadingOverlay.classList.remove('hidden');
}

function hideLoading(): void {
  loadingOverlay.classList.add('hidden');
}

function showStatus(isSuccess: boolean, title: string, message: string, details?: VerifyData): void {
  paymentCard.classList.add('hidden');
  statusCard.classList.remove('hidden');
  
  statusIcon.className = `status-icon ${isSuccess ? 'success' : 'error'}`;
  statusIcon.innerHTML = isSuccess 
    ? `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>`;
  
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  
  if (details) {
    transactionDetails.innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Reference</span>
        <span class="detail-value">${details.reference}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Amount</span>
        <span class="detail-value">${details.currency} ${details.amount.toFixed(2)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">${details.customer_email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Channel</span>
        <span class="detail-value">${details.channel}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value" style="color: var(--accent-400)">${details.gateway_response}</span>
      </div>
    `;
    transactionDetails.classList.remove('hidden');
  } else {
    transactionDetails.classList.add('hidden');
  }
}

function resetForm(): void {
  paymentCard.classList.remove('hidden');
  statusCard.classList.add('hidden');
  emailInput.value = '';
  amountInput.value = '';
}

function validateForm(): boolean {
  const email = emailInput.value.trim();
  const amount = parseFloat(amountInput.value);
  
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address');
    emailInput.focus();
    return false;
  }
  
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount');
    amountInput.focus();
    return false;
  }
  
  return true;
}

// API Functions
async function initializePopupPayment(email: string, amount: number): Promise<InitializePopupData> {
  const response = await fetch(`${API_BASE_URL}/initialize-popup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount,
      metadata: {
        payment_type: 'popup',
        custom_fields: [
          {
            display_name: 'Payment Method',
            variable_name: 'payment_method',
            value: 'Popup Checkout',
          },
        ],
      },
    }),
  });
  
  const data: ApiResponse<InitializePopupData> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to initialize payment');
  }
  
  return data.data;
}

async function initializeRedirectPayment(email: string, amount: number): Promise<InitializeRedirectData> {
  const callbackUrl = `${window.location.origin}/callback.html`;
  
  const response = await fetch(`${API_BASE_URL}/initialize-redirect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount,
      callback_url: callbackUrl,
      metadata: {
        payment_type: 'redirect',
        custom_fields: [
          {
            display_name: 'Payment Method',
            variable_name: 'payment_method',
            value: 'Redirect Checkout',
          },
        ],
      },
    }),
  });
  
  const data: ApiResponse<InitializeRedirectData> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to initialize payment');
  }
  
  return data.data;
}

async function verifyPayment(reference: string): Promise<VerifyData> {
  const response = await fetch(`${API_BASE_URL}/verify/${encodeURIComponent(reference)}`);
  const data: ApiResponse<VerifyData> = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to verify payment');
  }
  
  return data.data;
}

// Payment Handlers
async function handlePopupPayment(): Promise<void> {
  if (!validateForm()) return;
  
  const email = emailInput.value.trim();
  const amount = parseFloat(amountInput.value);
  
  try {
    showLoading();
    
    // Initialize transaction on backend
    const { access_code } = await initializePopupPayment(email, amount);
    
    hideLoading();
    
    // Open Paystack popup using access code
    const popup = new window.PaystackPop();
    popup.resumeTransaction(access_code, {
      onSuccess: async (response: PaystackResponse) => {
        console.log('Payment successful:', response);
        showLoading();
        
        try {
          // Verify payment on backend
          const verifyData = await verifyPayment(response.reference);
          hideLoading();
          
          if (verifyData.status === 'success') {
            showStatus(true, 'Payment Successful!', 'Your payment has been processed successfully.', verifyData);
          } else {
            showStatus(false, 'Payment Incomplete', `Status: ${verifyData.status}`, verifyData);
          }
        } catch (error) {
          hideLoading();
          showStatus(
            true, 
            'Payment Received!', 
            'Your payment was received. Verification pending.'
          );
        }
      },
      onCancel: () => {
        console.log('Payment cancelled');
        showStatus(false, 'Payment Cancelled', 'You cancelled the payment. No charges were made.');
      },
    });
  } catch (error) {
    hideLoading();
    console.error('Popup payment error:', error);
    showStatus(
      false, 
      'Payment Failed', 
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

async function handleRedirectPayment(): Promise<void> {
  if (!validateForm()) return;
  
  const email = emailInput.value.trim();
  const amount = parseFloat(amountInput.value);
  
  try {
    showLoading();
    
    // Initialize transaction on backend
    const { authorization_url } = await initializeRedirectPayment(email, amount);
    
    // Redirect to Paystack checkout
    window.location.href = authorization_url;
  } catch (error) {
    hideLoading();
    console.error('Redirect payment error:', error);
    showStatus(
      false, 
      'Payment Failed', 
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}

// Event Listeners
popupBtn.addEventListener('click', handlePopupPayment);
redirectBtn.addEventListener('click', handleRedirectPayment);
resetBtn.addEventListener('click', resetForm);

// Prevent form submission
paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

// Console welcome message
console.log('%c💳 PayFlow Payment Demo', 'font-size: 20px; font-weight: bold; color: #7c3aed');
console.log('%cBuilt with Paystack integration', 'color: #10b981');
