# 🔐 Modal Voting Flow - Backend Implementation Guide

This document outlines the secure modal-based voting flow implemented for both voting and ticket purchases, providing real-time payment verification without relying solely on webhooks.

## 🎯 New Endpoints

### **Voting Endpoints**

#### 1. Check Vote Payment Status
```http
GET /api/candidates/votes/status/:txRef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txRef": "vote_1642857600000_abc123def",
    "paymentStatus": "pending",
    "candidateId": "candidate123",
    "amount": 1000,
    "points": 10,
    "createdAt": "2025-01-19T10:30:00Z",
    "confirmedAt": null
  }
}
```

#### 2. Manually Verify Vote Payment
```http
POST /api/candidates/votes/:txRef/verify-payment
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "paymentStatus": "confirmed",
    "message": "Vote confirmé avec succès",
    "points": 10
  }
}
```

### **Ticket Endpoints**

#### 1. Check Ticket Payment Status
```http
GET /api/tickets/status/:txRef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txRef": "ticket_1642857600000_abc123def",
    "paymentStatus": "pending",
    "ticketNumber": "WAY2024-TICKET-001",
    "amount": 1000,
    "customerName": "John Doe",
    "situation": "rouge",
    "createdAt": "2025-01-19T10:30:00Z"
  }
}
```

#### 2. Manually Verify Ticket Payment
```http
POST /api/tickets/verify-payment/:txRef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "paymentStatus": "confirmed",
    "message": "Ticket confirmé avec succès",
    "ticketNumber": "WAY2024-TICKET-001",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

## 🔒 Enhanced Security Features

### **New Schema Fields**

Both Vote and Ticket schemas now include:

```typescript
// Tracking fields for secure modal flow
lastStatusCheck?: Date;        // Last time status was checked
verificationAttempts?: number; // Number of manual verification attempts
lastVerificationAt?: Date;     // Last manual verification attempt
manuallyVerified?: boolean;    // Whether payment was manually verified
verifiedBy?: string;          // Admin/user who manually verified
```

### **Rate Limiting**

- **Status Checks**: 30 per minute per IP
- **Manual Verification**: 10 per minute per IP
- **Vote Creation**: 5 per minute per IP
- **Ticket Purchase**: 3 per minute per IP

## 🔄 Frontend Implementation Flow

### **1. Modal Voting Component**

```javascript
const ModalVotingFlow = ({ candidateId, onSuccess }) => {
  const [step, setStep] = useState('payment'); // payment, polling, success
  const [txRef, setTxRef] = useState(null);
  const [paymentInstructions, setPaymentInstructions] = useState('');

  // Step 1: Create vote and get payment instructions
  const createVote = async (voteData) => {
    const response = await fetch('/api/candidates/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voteData)
    });
    
    const result = await response.json();
    if (result.success) {
      setTxRef(result.data.txRef);
      setPaymentInstructions(result.data.paymentInstructions);
      setStep('polling');
      startPolling(result.data.txRef);
    }
  };

  // Step 2: Poll payment status
  const startPolling = (txRef) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/candidates/votes/status/${txRef}`);
        const result = await response.json();
        
        if (result.success && result.data.paymentStatus === 'confirmed') {
          clearInterval(pollInterval);
          setStep('success');
          onSuccess(result.data);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  // Step 3: Manual verification fallback
  const manualVerify = async () => {
    const response = await fetch(`/api/candidates/votes/${txRef}/verify-payment`, {
      method: 'POST'
    });
    
    const result = await response.json();
    if (result.success && result.data.verified) {
      setStep('success');
      onSuccess(result.data);
    }
  };

  return (
    <div className="modal">
      {step === 'payment' && <PaymentForm onSubmit={createVote} />}
      {step === 'polling' && (
        <PollingStatus 
          instructions={paymentInstructions}
          onManualVerify={manualVerify}
        />
      )}
      {step === 'success' && <SuccessMessage />}
    </div>
  );
};
```

### **2. Ticket Purchase Flow**

```javascript
const TicketPurchaseFlow = ({ onSuccess }) => {
  // Similar implementation for tickets
  const createTicket = async (ticketData) => {
    const response = await fetch('/api/tickets/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    // ... similar polling logic
  };

  const pollTicketStatus = async (txRef) => {
    const response = await fetch(`/api/tickets/status/${txRef}`);
    // ... handle ticket confirmation
  };
};
```

## 🛡️ Security Improvements

### **1. No Webhook Dependency**
- Real-time status checking without waiting for webhooks
- Manual verification as fallback option
- Reduced payment confirmation delays

### **2. Payment Tracking**
- Automatic tracking of status check frequency
- Manual verification attempt logging
- Enhanced audit trail for payments

### **3. SoleasPay Integration**
- Direct API verification with SoleasPay
- Real-time payment status confirmation
- Automatic candidate point updates
- Automatic QR code email delivery for tickets

## 📊 Backend Logging & Monitoring

### **Vote Payment Tracking**
```typescript
// Automatic logging includes:
- Vote creation with SoleasPay initiation
- Payment status checks with timestamps
- Manual verification attempts
- Successful confirmations with point updates
- Failed verification attempts
```

### **Ticket Purchase Tracking**
```typescript
// Automatic logging includes:
- Ticket purchase initiation
- QR code generation and validation
- Payment confirmation and email delivery
- Manual verification attempts
- Entrance validation events
```

## 🚀 Deployment Considerations

1. **Database Indexes**: Ensure indexes on `txRef` fields for fast lookups
2. **Rate Limiting**: Configure appropriate rate limits for your traffic
3. **Monitoring**: Set up alerts for high verification failure rates
4. **Cache Management**: Status checks update cache timestamps
5. **Email Queue**: Ensure email service can handle QR code delivery volume

## ✅ Benefits of This Implementation

- **🔒 Enhanced Security**: Multi-layered payment verification
- **⚡ Real-time Updates**: Immediate payment status feedback
- **🛡️ Redundancy**: Multiple confirmation paths (webhook + manual)
- **📊 Better UX**: Modal-based flow with clear progress indication
- **🔍 Audit Trail**: Complete tracking of payment lifecycle
- **📱 Mobile Friendly**: Optimized for mobile money payment flows

This implementation provides a robust, secure, and user-friendly payment flow that works reliably even when webhooks are delayed or fail. 