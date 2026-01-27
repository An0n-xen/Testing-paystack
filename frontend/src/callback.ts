import './style.css';

// Configuration - uses Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.41.246.221:3000/api/payment';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
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
const loadingCard = document.getElementById('loading-card') as HTMLDivElement;
const resultCard = document.getElementById('result-card') as HTMLDivElement;
const statusIcon = document.getElementById('status-icon') as HTMLDivElement;
const statusTitle = document.getElementById('status-title') as HTMLHeadingElement;
const statusMessage = document.getElementById('status-message') as HTMLParagraphElement;
const transactionDetails = document.getElementById('transaction-details') as HTMLDivElement;

// Utility Functions
function getTransactionReference(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  // Paystack appends ?reference=xxx or ?trxref=xxx
  return urlParams.get('reference') || urlParams.get('trxref');
}

function showResult(isSuccess: boolean, title: string, message: string, details?: VerifyData): void {
  loadingCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  
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
        <span class="detail-value" style="color: ${isSuccess ? 'var(--accent-400)' : 'hsl(0, 100%, 60%)'}">${details.gateway_response}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Paid At</span>
        <span class="detail-value">${new Date(details.paid_at).toLocaleString()}</span>
      </div>
    `;
    transactionDetails.classList.remove('hidden');
  } else {
    transactionDetails.classList.add('hidden');
  }
}

// API Functions
async function verifyPayment(reference: string): Promise<VerifyData> {
  const response = await fetch(`${API_BASE_URL}/verify/${encodeURIComponent(reference)}`);
  const data: ApiResponse<VerifyData> = await response.json();
  console.log(API_BASE_URL);
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to verify payment');
  }
  
  return data.data;
}

// Main verification flow
async function verifyTransaction(): Promise<void> {
  const reference = getTransactionReference();
  
  if (!reference) {
    showResult(
      false,
      'No Transaction Found',
      'No transaction reference was provided. Please try making a new payment.'
    );
    return;
  }
  
  try {
    const verifyData = await verifyPayment(reference);
    
    if (verifyData.status === 'success') {
      showResult(
        true,
        'Payment Successful!',
        'Your payment has been processed and verified.',
        verifyData
      );
    } else if (verifyData.status === 'abandoned') {
      showResult(
        false,
        'Payment Abandoned',
        'This transaction was not completed.',
        verifyData
      );
    } else {
      showResult(
        false,
        'Payment Incomplete',
        `Transaction status: ${verifyData.status}`,
        verifyData
      );
    }
  } catch (error) {
    console.error('Verification error:', error);
    showResult(
      false,
      'Verification Failed',
      error instanceof Error ? error.message : 'Unable to verify the transaction. Please contact support.'
    );
  }
}

// Run verification on page load
verifyTransaction();

// Console message
console.log('%c💳 PayFlow - Payment Callback', 'font-size: 16px; font-weight: bold; color: #7c3aed');
console.log('Verifying transaction reference:', getTransactionReference());
