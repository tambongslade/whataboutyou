# WAYBack API - Frontend Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [API Base Configuration](#api-base-configuration)
3. [Candidate System](#candidate-system)
4. [Payment & Voting System](#payment--voting-system)
5. [Error Handling](#error-handling)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [React Implementation Examples](#react-implementation-examples)
8. [Testing & Development](#testing--development)

## Overview

This guide provides complete frontend integration for the WAYBack Conference API, focusing on candidate management and Flutterwave payment integration for voting.

### Key Features
- **Miss WAY 2025 Candidate Voting** with mobile money payments
- **Flutterwave Integration** for MTN and Orange Money (Cameroon)
- **Real-time Rankings** and vote counting
- **Secure Payment Verification** with webhooks

---

## API Base Configuration

### Base URL & Authentication
```javascript
const API_BASE_URL = 'http://localhost:3001/api'; // Development
// const API_BASE_URL = 'https://your-production-api.com/api'; // Production

// API Client Setup
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for payment operations
});
```

### Rate Limiting
- **Candidate endpoints**: 20 requests/minute
- **Vote creation**: 5 requests/minute  
- **Payment verification**: 10 requests/minute

---

## Candidate System

### 1. Get All Candidates

```javascript
// Get all candidates
const getAllCandidates = async () => {
  try {
    const response = await apiClient.get('/candidates');
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

// Response format:
{
  "success": true,
  "data": [
    {
      "id": "candidate_id_123",
      "name": "EDIDIGUE SOPHIE NATACHA",
      "category": "miss",
      "ranking": 1,
      "points": 150,
      "votes": 150,
      "image": "/miss2025/c1.jpg",
      "sash": "MISS WAY 2025",
      "age": 22,
      "city": "Douala",
      "profession": "Étudiante en Commerce International",
      "hobbies": ["Danse", "Photographie", "Voyage", "Lecture"],
      "description": "Passionnée par l'art et la culture...",
      "socialMedia": {
        "instagram": "@sophie_natacha",
        "facebook": "Sophie Natacha Edidigue",
        "tiktok": "@sophienatacha"
      },
      "isActive": true,
      "createdAt": "2025-01-19T20:00:00Z",
      "updatedAt": "2025-01-19T21:30:00Z"
    }
  ],
  "count": 13
}
```

### 2. Get Candidates by Category

```javascript
// Get Miss candidates only
const getMissCandidates = async () => {
  try {
    const response = await apiClient.get('/candidates?category=miss');
    return response.data;
  } catch (error) {
    console.error('Error fetching Miss candidates:', error);
    throw error;
  }
};

// Get Master candidates (when available)
const getMasterCandidates = async () => {
  try {
    const response = await apiClient.get('/candidates?category=master');
    return response.data;
  } catch (error) {
    console.error('Error fetching Master candidates:', error);
    throw error;
  }
};
```

### 3. Get Single Candidate

```javascript
const getCandidate = async (candidateId) => {
  try {
    const response = await apiClient.get(`/candidates/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate:', error);
    throw error;
  }
};
```

### 4. Get Candidate Statistics

```javascript
const getCandidateStats = async () => {
  try {
    const response = await apiClient.get('/candidates/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Response format:
{
  "success": true,
  "data": {
    "total": 13,
    "byCategory": {
      "miss": 13,
      "master": 0
    },
    "active": 13,
    "inactive": 0,
    "totalVotes": 1250,
    "averageAge": 22
  }
}
```

---

## Payment & Voting System

### 1. Create Vote with Payment

```javascript
const createVote = async (voteData) => {
  try {
    const response = await apiClient.post('/candidates/votes', voteData);
    return response.data;
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
};

// Usage example:
const voteData = {
  candidateId: 'candidate_id_123',
  phoneNumber: '674123456', // Cameroon format
  paymentMethod: 'MTN', // or 'ORANGEMONEY'
  amount: 1000, // FCFA (minimum 500)
  email: 'voter@example.com',
  customerName: 'John Doe'
};

const result = await createVote(voteData);
console.log('Payment Link:', result.data.paymentLink);
console.log('Transaction Ref:', result.data.txRef);
```

### 2. Payment Flow Implementation

```javascript
// Complete voting flow
const handleVoteSubmission = async (candidateId, voterInfo, amount, paymentMethod) => {
  try {
    // Step 1: Create vote and get payment link
    const voteResponse = await createVote({
      candidateId,
      phoneNumber: voterInfo.phone,
      paymentMethod, // 'MTN' or 'ORANGEMONEY'
      amount,
      email: voterInfo.email,
      customerName: voterInfo.name
    });

    if (!voteResponse.success) {
      throw new Error(voteResponse.error);
    }

    const { paymentLink, txRef } = voteResponse.data;

    // Step 2: Store transaction reference for later verification
    localStorage.setItem('pendingVote', JSON.stringify({
      txRef,
      candidateId,
      amount,
      timestamp: Date.now()
    }));

    // Step 3: Redirect to Flutterwave payment
    window.location.href = paymentLink;

    return { success: true, txRef, paymentLink };
  } catch (error) {
    console.error('Vote submission failed:', error);
    return { success: false, error: error.message };
  }
};
```

### 3. Payment Verification

```javascript
// Verify payment after user returns from Flutterwave
const verifyPayment = async (txRef) => {
  try {
    const response = await apiClient.post('/payments/verify', { txRef });
    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};

// Confirm vote after successful payment
const confirmVote = async (txRef) => {
  try {
    const response = await apiClient.post(`/candidates/votes/${txRef}/confirm`);
    return response.data;
  } catch (error) {
    console.error('Vote confirmation failed:', error);
    throw error;
  }
};

// Complete verification flow
const handlePaymentReturn = async () => {
  const pendingVote = JSON.parse(localStorage.getItem('pendingVote') || '{}');
  
  if (!pendingVote.txRef) {
    console.error('No pending vote found');
    return;
  }

  try {
    // Verify payment with Flutterwave
    const paymentResult = await verifyPayment(pendingVote.txRef);
    
    if (paymentResult.status === 'successful') {
      // Confirm vote and add points
      const voteResult = await confirmVote(pendingVote.txRef);
      
      if (voteResult.success) {
        console.log(`Vote confirmed! ${voteResult.data.points} points added`);
        localStorage.removeItem('pendingVote');
        
        // Refresh candidate data to show updated points
        await refreshCandidateData();
        
        return { success: true, points: voteResult.data.points };
      }
    } else {
      console.error('Payment failed or pending');
      return { success: false, error: 'Payment not completed' };
    }
  } catch (error) {
    console.error('Verification failed:', error);
    return { success: false, error: error.message };
  }
};
```

### 4. Payment Status Polling

```javascript
// Poll payment status for better UX
const pollPaymentStatus = async (txRef, maxAttempts = 20) => {
  let attempts = 0;
  
  const poll = async () => {
    try {
      const result = await verifyPayment(txRef);
      
      if (result.status === 'successful') {
        return { status: 'completed', data: result };
      } else if (result.status === 'failed') {
        return { status: 'failed', data: result };
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        return { status: 'timeout', data: null };
      }
      
      // Wait 3 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 3000));
      return poll();
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        return { status: 'error', error: error.message };
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      return poll();
    }
  };
  
  return poll();
};
```

---

## Error Handling

### Common Error Responses

```javascript
// Error response format
{
  "success": false,
  "error": "Error message in French"
}

// Common errors:
const ERROR_MESSAGES = {
  CANDIDATE_NOT_FOUND: "Candidat non trouvé",
  CANDIDATE_INACTIVE: "Ce candidat n'accepte plus de votes",
  PAYMENT_FAILED: "Le paiement a échoué",
  PAYMENT_PENDING: "Le paiement est en attente",
  VOTE_ALREADY_PROCESSED: "Ce vote a déjà été traité",
  INSUFFICIENT_AMOUNT: "Le montant minimum est de 500 FCFA",
  INVALID_PHONE: "Format de numéro de téléphone invalide pour le Cameroun",
  NETWORK_ERROR: "Erreur de connexion"
};
```

### Error Handling Utility

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `Erreur de validation: ${data.error || data.message}`;
      case 404:
        return "Ressource non trouvée";
      case 429:
        return "Trop de requêtes. Veuillez patienter.";
      case 500:
        return "Erreur serveur. Veuillez réessayer.";
      default:
        return data.error || "Une erreur est survenue";
    }
  } else if (error.request) {
    // Network error
    return "Erreur de connexion. Vérifiez votre connexion internet.";
  } else {
    // Other error
    return error.message || "Une erreur inattendue s'est produite";
  }
};
```

---

## TypeScript Interfaces

```typescript
// Candidate interfaces
interface Candidate {
  id: string;
  name: string;
  category: 'miss' | 'master';
  ranking: number;
  points: number;
  votes: number;
  image: string;
  sash: string;
  age?: number;
  city?: string;
  profession?: string;
  hobbies?: string[];
  description?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vote interfaces
interface CreateVoteRequest {
  candidateId: string;
  phoneNumber: string;
  paymentMethod: 'MTN' | 'ORANGEMONEY';
  amount: number;
  email: string;
  customerName: string;
}

interface VoteResponse {
  success: boolean;
  data?: {
    paymentLink: string;
    txRef: string;
  };
  error?: string;
}

// Payment interfaces
interface PaymentVerification {
  txRef: string;
}

interface PaymentResult {
  id: string;
  txRef: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  phoneNumber: string;
  network: string;
  customerEmail: string;
  candidateId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// API Response interfaces
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface CandidateListResponse extends ApiResponse<Candidate[]> {
  count: number;
}

interface CandidateStats {
  total: number;
  byCategory: {
    miss: number;
    master: number;
  };
  active: number;
  inactive: number;
  totalVotes: number;
  averageAge: number;
}
```

---

## React Implementation Examples

### 1. Candidate List Component

```tsx
import React, { useState, useEffect } from 'react';

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await getAllCandidates();
      
      if (response.success) {
        // Sort by ranking
        const sortedCandidates = response.data.sort((a, b) => a.ranking - b.ranking);
        setCandidates(sortedCandidates);
      } else {
        setError(response.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement des candidates...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="candidate-grid">
      {candidates.map((candidate) => (
        <CandidateCard 
          key={candidate.id} 
          candidate={candidate}
          onVote={() => loadCandidates()} // Refresh after vote
        />
      ))}
    </div>
  );
};
```

### 2. Voting Component

```tsx
import React, { useState } from 'react';

interface VotingFormProps {
  candidate: Candidate;
  onVoteComplete: () => void;
}

const VotingForm: React.FC<VotingFormProps> = ({ candidate, onVoteComplete }) => {
  const [formData, setFormData] = useState({
    amount: 1000,
    phoneNumber: '',
    paymentMethod: 'MTN' as 'MTN' | 'ORANGEMONEY',
    email: '',
    customerName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await handleVoteSubmission(
        candidate.id,
        {
          phone: formData.phoneNumber,
          email: formData.email,
          name: formData.customerName
        },
        formData.amount,
        formData.paymentMethod
      );

      if (result.success) {
        // Payment link will redirect user
        console.log('Redirecting to payment...');
      } else {
        setError(result.error || 'Erreur lors de la création du vote');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const points = Math.floor(formData.amount / 500);

  return (
    <form onSubmit={handleSubmit} className="voting-form">
      <h3>Voter pour {candidate.name}</h3>
      
      <div className="form-group">
        <label>Montant (FCFA)</label>
        <select 
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
        >
          <option value={500}>500 FCFA (1 point)</option>
          <option value={1000}>1000 FCFA (2 points)</option>
          <option value={2500}>2500 FCFA (5 points)</option>
          <option value={5000}>5000 FCFA (10 points)</option>
        </select>
        <small>{points} point{points > 1 ? 's' : ''}</small>
      </div>

      <div className="form-group">
        <label>Réseau Mobile</label>
        <select 
          value={formData.paymentMethod}
          onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'MTN' | 'ORANGEMONEY'})}
        >
          <option value="MTN">MTN Mobile Money</option>
          <option value="ORANGEMONEY">Orange Money</option>
        </select>
      </div>

      <div className="form-group">
        <label>Numéro de téléphone</label>
        <input
          type="tel"
          placeholder="674123456"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Nom complet</label>
        <input
          type="text"
          placeholder="Votre nom complet"
          value={formData.customerName}
          onChange={(e) => setFormData({...formData, customerName: e.target.value})}
          required
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button 
        type="submit" 
        disabled={loading || !candidate.isActive}
        className="vote-button"
      >
        {loading ? 'Traitement...' : `Voter (${formData.amount} FCFA)`}
      </button>

      {!candidate.isActive && (
        <p className="inactive-notice">Ce candidat n'accepte plus de votes</p>
      )}
    </form>
  );
};
```

### 3. Payment Return Handler

```tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PaymentReturn: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    handlePaymentReturn();
  }, []);

  const handlePaymentReturn = async () => {
    try {
      const result = await handlePaymentReturn();
      
      if (result.success) {
        setStatus('success');
        setMessage('Vote confirmé avec succès!');
        setPoints(result.points);
        
        // Redirect to candidates page after 3 seconds
        setTimeout(() => {
          router.push('/candidates');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage(result.error || 'Le paiement a échoué');
      }
    } catch (error) {
      setStatus('failed');
      setMessage('Erreur lors de la vérification du paiement');
    }
  };

  return (
    <div className="payment-result">
      {status === 'loading' && (
        <div>
          <div className="spinner"></div>
          <p>Vérification du paiement...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="success">
          <h2>✅ Paiement réussi!</h2>
          <p>{message}</p>
          <p><strong>{points} points</strong> ajoutés au candidat</p>
          <p>Redirection en cours...</p>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="error">
          <h2>❌ Paiement échoué</h2>
          <p>{message}</p>
          <button onClick={() => router.push('/candidates')}>
            Retour aux candidats
          </button>
        </div>
      )}
    </div>
  );
};
```

---

## Testing & Development

### 1. Test Phone Numbers (Cameroon)
```javascript
const TEST_PHONES = {
  MTN: ['674123456', '675987654', '676555444'],
  ORANGE: ['695123456', '697987654', '698555444']
};
```

### 2. Test Payment Amounts
```javascript
const TEST_AMOUNTS = [
  { amount: 500, points: 1, label: '500 FCFA (1 point)' },
  { amount: 1000, points: 2, label: '1000 FCFA (2 points)' },
  { amount: 2500, points: 5, label: '2500 FCFA (5 points)' },
  { amount: 5000, points: 10, label: '5000 FCFA (10 points)' }
];
```

### 3. Environment Variables
```javascript
// .env.local (Next.js) or .env (React)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

### 4. Swagger Documentation
- **Development**: `http://localhost:3001/api/docs`
- **Interactive API testing** with real examples
- **Complete endpoint documentation** with request/response schemas

---

## Security Considerations

1. **Never expose sensitive data** in frontend code
2. **Validate all user inputs** before sending to API
3. **Handle payment redirects securely** with proper state management
4. **Implement proper error handling** for payment failures
5. **Use HTTPS in production** for all API calls
6. **Store transaction references securely** (localStorage with expiry)

---

## Production Checklist

- [ ] Update API base URLs for production
- [ ] Configure proper CORS settings
- [ ] Set up proper error logging
- [ ] Test payment flow with real mobile money
- [ ] Implement proper loading states
- [ ] Add accessibility features
- [ ] Test with different network conditions
- [ ] Implement proper caching strategy
- [ ] Set up monitoring for payment failures
- [ ] Configure proper SEO meta tags

---

*This guide covers the complete frontend integration for the WAYBack Conference voting system. For additional support or questions, refer to the Swagger documentation at `/api/docs`.*