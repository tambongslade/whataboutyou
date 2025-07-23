# WAYBack Frontend Integration Guide - MongoDB Edition

## Overview

The WAYBack system has been **fully migrated from Firebase to MongoDB**, providing improved performance, better data consistency, and enhanced scalability. This guide covers the complete integration for frontend applications.

## 🚀 Key Changes After MongoDB Migration

### Database Architecture
- **Primary Database**: MongoDB (`whataboutyou` database)
- **Authentication**: JWT-based (no more Firebase Auth)
- **Real-time Updates**: RESTful API with polling/webhooks
- **Currency**: All amounts in **FCFA** (Franc CFA)
- **Performance**: Optimized MongoDB aggregations and caching

### Migration Benefits
- ✅ **Faster Queries**: MongoDB aggregation pipelines
- ✅ **Better Scaling**: Horizontal scaling capabilities  
- ✅ **Simplified Auth**: Standard JWT tokens
- ✅ **Cost Effective**: No Firebase usage fees
- ✅ **Local Currency**: Native FCFA support

## API Base Configuration

### Environment Setup
```typescript
// Frontend Environment Variables
const API_CONFIG = {
  BASE_URL: 'https://your-api-domain.com/api',
  // No more Firebase config needed!
  JWT_STORAGE_KEY: 'wayback_jwt_token'
};
```

### Authentication Headers
```typescript
// JWT Authentication (replaces Firebase Auth)
const getAuthHeaders = () => {
  const token = localStorage.getItem('wayback_jwt_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
```

## Core API Endpoints

### 1. Conference Registration System

#### Register for Conference
```http
POST /api/registrations
Content-Type: application/json

{
  "situation": "rouge",                    // rouge | bleu | jaune
  "nom": "Dupont",
  "prenom": "Jean",
  "age": "25",
  "sexe": "Homme",                        // Homme | Femme
  "numeroTelephone": "+237698123456",
  "email": "jean.dupont@email.com",
  "quartier": "Yaoundé Centre",
  "statut": "etudiant",                   // etudiant | travailleur | entrepreneur | autre
  "organisation": "Université de Yaoundé",
  "aDejaParticipe": "non",                // oui | non
  "nationalite": "Camerounaise"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationNumber": "WAY2025-001",
    "message": "Inscription réussie! Vous recevrez un email de confirmation sous peu."
  }
}
```

#### Get Registration Statistics
```http
GET /api/registrations/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 285,
    "byStatus": {
      "rouge": 120,
      "bleu": 95,
      "jaune": 70
    },
    "byExperience": {
      "oui": 180,
      "non": 105
    },
    "emailStats": {
      "sent": 280,
      "pending": 5
    },
    "averageAge": 24,
    "todayRegistrations": 12
  }
}
```

### 2. Miss & Master Voting System

#### Get All Candidates
```http
GET /api/candidates
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "EDIDIGUE SOPHIE NATACHA",
      "category": "miss",
      "ranking": 1,
      "image": "/miss2025/c1.jpg",
      "sash": "MISS WAY 2025",
      "age": 22,
      "city": "Douala",
      "profession": "Étudiante en Commerce International",
      "hobbies": ["Danse", "Photographie", "Voyage", "Lecture"],
      "description": "Passionnée par l'art et la culture...",
      "socialMedia": {
        "instagram": "@sophie_natacha",
        "facebook": "Sophie Natacha Edidigue"
      },
      "isActive": true,
      "votes": 150,
      "createdAt": "2025-01-19T10:30:00Z",
      "updatedAt": "2025-01-19T15:45:00Z"
    }
  ]
}
```

#### Get Candidates by Category
```http
GET /api/candidates/category/miss
GET /api/candidates/category/master
```

#### Vote for Candidate
```http
POST /api/candidates/:candidateId/vote
Content-Type: application/json

{
  "customerName": "Marie Dupont",
  "email": "marie@email.com",
  "phoneNumber": "+237698123456",
  "amount": 500,                          // Amount in FCFA
  "paymentMethod": "MOMO"                 // MOMO | OM | MTN | ORANGEMONEY
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentInstructions": "Composez *126# puis suivez les instructions pour envoyer 500 FCFA au numéro +237698123456",
    "soleasOrderId": "WAY_1642857600000_507f1f77bcf86cd799439011",
    "txRef": "vote_1642857600000_abc123def"
  }
}
```

#### Confirm Vote Payment
```http
POST /api/candidates/votes/confirm/:txRef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Vote confirmé avec succès",
    "points": 5
  }
}
```

### 3. Ticket System

#### Purchase Event Ticket
```http
POST /api/tickets/purchase
Content-Type: application/json

{
  "customerName": "Jean Doe",
  "customerEmail": "jean@example.com",
  "customerPhone": "+237674123456",
  "situation": "rouge",                   // rouge | bleu | jaune
  "price": 1000,                         // Fixed price in FCFA
  "validDate": "2024-12-25",             // YYYY-MM-DD
  "paymentMethod": "MOMO"                // MOMO | OM | MTN | ORANGEMONEY
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentInstructions": "Composez *126# puis suivez les instructions pour envoyer 1000 FCFA",
    "soleasOrderId": "WAY_TICKET_1642857600000_WAY2025-TICKET-001",
    "txRef": "ticket_1642857600000_abc123def",
    "ticketNumber": "WAY2025-TICKET-001"
  }
}
```

#### Confirm Ticket Payment
```http
POST /api/tickets/confirm/:txRef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Ticket confirmé avec succès",
    "ticketNumber": "WAY2025-TICKET-001",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

#### Validate Ticket (Admin Only)
```http
POST /api/tickets/validate
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "ticketNumber": "WAY2025-TICKET-001",
  "qrData": "{\"ticketNumber\":\"WAY2025-TICKET-001\",\"validDate\":\"2024-12-25\",\"email\":\"jean@example.com\",\"situation\":\"rouge\",\"timestamp\":1642857600000}"
}
```

### 4. Payment Integration

#### Check Payment Status
```http
GET /api/payments/status/:txRef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "txRef": "vote_1642857600000_abc123def",
    "amount": 500,
    "currency": "XAF",
    "phoneNumber": "+237698123456",
    "customerName": "Marie Dupont",
    "status": "SUCCESSFUL",
    "createdAt": "2025-01-19T10:30:00Z",
    "completedAt": "2025-01-19T10:32:00Z"
  }
}
```

## Frontend Implementation Examples

### 1. React/Next.js Integration

#### Setup API Client
```typescript
// lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('wayback_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Registration Component
```typescript
// components/ConferenceRegistration.tsx
import { useState } from 'react';
import { apiClient } from '../lib/api';

interface RegistrationData {
  situation: 'rouge' | 'bleu' | 'jaune';
  nom: string;
  prenom: string;
  age: string;
  sexe: 'Homme' | 'Femme';
  numeroTelephone: string;
  email: string;
  quartier: string;
  statut: 'etudiant' | 'travailleur' | 'entrepreneur' | 'autre';
  organisation?: string;
  aDejaParticipe: 'oui' | 'non';
  nationalite: string;
}

export default function ConferenceRegistration() {
  const [formData, setFormData] = useState<RegistrationData>({
    situation: 'rouge',
    nom: '',
    prenom: '',
    age: '',
    sexe: 'Homme',
    numeroTelephone: '',
    email: '',
    quartier: '',
    statut: 'etudiant',
    organisation: '',
    aDejaParticipe: 'non',
    nationalite: 'Camerounaise'
  });

  const [loading, setLoading] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/registrations', formData);
      setRegistrationNumber(response.data.data.registrationNumber);
      
      // Show success message
      alert(`Inscription réussie! Numéro: ${response.data.data.registrationNumber}`);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Situation Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Situation
        </label>
        <select
          value={formData.situation}
          onChange={(e) => setFormData({...formData, situation: e.target.value as any})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="rouge">Rouge</option>
          <option value="bleu">Bleu</option>
          <option value="jaune">Jaune</option>
        </select>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nom"
          value={formData.nom}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          required
          className="rounded-md border-gray-300 shadow-sm"
        />
        <input
          type="text"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={(e) => setFormData({...formData, prenom: e.target.value})}
          required
          className="rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Âge"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
          required
          className="rounded-md border-gray-300 shadow-sm"
        />
        <select
          value={formData.sexe}
          onChange={(e) => setFormData({...formData, sexe: e.target.value as any})}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
        </select>
        <input
          type="tel"
          placeholder="Téléphone (+237...)"
          value={formData.numeroTelephone}
          onChange={(e) => setFormData({...formData, numeroTelephone: e.target.value})}
          required
          className="rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
        className="w-full rounded-md border-gray-300 shadow-sm"
      />

      <input
        type="text"
        placeholder="Quartier"
        value={formData.quartier}
        onChange={(e) => setFormData({...formData, quartier: e.target.value})}
        required
        className="w-full rounded-md border-gray-300 shadow-sm"
      />

      {/* Status and Organization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={formData.statut}
          onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value="etudiant">Étudiant</option>
          <option value="travailleur">Travailleur</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="autre">Autre</option>
        </select>
        <input
          type="text"
          placeholder="Organisation (optionnel)"
          value={formData.organisation}
          onChange={(e) => setFormData({...formData, organisation: e.target.value})}
          className="rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {/* Previous Participation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Avez-vous déjà participé à WAYBack?
        </label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="oui"
              checked={formData.aDejaParticipe === 'oui'}
              onChange={(e) => setFormData({...formData, aDejaParticipe: 'oui'})}
              className="form-radio"
            />
            <span className="ml-2">Oui</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="non"
              checked={formData.aDejaParticipe === 'non'}
              onChange={(e) => setFormData({...formData, aDejaParticipe: 'non'})}
              className="form-radio"
            />
            <span className="ml-2">Non</span>
          </label>
        </div>
      </div>

      <input
        type="text"
        placeholder="Nationalité"
        value={formData.nationalite}
        onChange={(e) => setFormData({...formData, nationalite: e.target.value})}
        required
        className="w-full rounded-md border-gray-300 shadow-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
      >
        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
      </button>

      {registrationNumber && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">Inscription réussie!</h3>
          <p>Votre numéro d'inscription: <strong>{registrationNumber}</strong></p>
          <p>Vous recevrez un email de confirmation sous peu.</p>
        </div>
      )}
    </form>
  );
}
```

#### Voting Component
```typescript
// components/VotingSystem.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface Candidate {
  _id: string;
  name: string;
  category: 'miss' | 'master';
  ranking: number;
  image: string;
  age: number;
  city: string;
  profession?: string;
  description?: string;
  votes: number;
  isActive: boolean;
}

interface VoteData {
  customerName: string;
  email: string;
  phoneNumber: string;
  amount: number;
  paymentMethod: 'MOMO' | 'OM' | 'MTN' | 'ORANGEMONEY';
}

export default function VotingSystem() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'miss' | 'master'>('miss');
  const [loading, setLoading] = useState(true);
  const [voteModal, setVoteModal] = useState<{ isOpen: boolean; candidate?: Candidate }>({
    isOpen: false
  });

  const [voteData, setVoteData] = useState<VoteData>({
    customerName: '',
    email: '',
    phoneNumber: '',
    amount: 100, // Default vote amount in FCFA
    paymentMethod: 'MOMO'
  });

  useEffect(() => {
    fetchCandidates();
  }, [selectedCategory]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/candidates/category/${selectedCategory}`);
      setCandidates(response.data.data);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId: string) => {
    try {
      const response = await apiClient.post(`/candidates/${candidateId}/vote`, voteData);
      const { paymentInstructions, txRef } = response.data.data;

      // Show payment instructions
      alert(`Vote initié!\n\n${paymentInstructions}\n\nRéférence: ${txRef}`);
      
      // Close modal
      setVoteModal({ isOpen: false });
      
      // You can implement payment confirmation flow here
      // For example, redirect to payment confirmation page
      window.location.href = `/payment/confirm?txRef=${txRef}`;
      
    } catch (error) {
      console.error('Vote failed:', error);
      alert('Erreur lors du vote. Veuillez réessayer.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Category Selection */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Concours Miss & Master WAYBack 2025
        </h1>
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setSelectedCategory('miss')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              selectedCategory === 'miss'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Miss WAY 2025
          </button>
          <button
            onClick={() => setSelectedCategory('master')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              selectedCategory === 'master'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Master WAY 2025
          </button>
        </div>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des candidats...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    #{candidate.ranking}
                  </span>
                  <span className="text-sm text-gray-500">
                    {candidate.votes} votes
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {candidate.name}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p><strong>Âge:</strong> {candidate.age} ans</p>
                  <p><strong>Ville:</strong> {candidate.city}</p>
                  {candidate.profession && (
                    <p><strong>Profession:</strong> {candidate.profession}</p>
                  )}
                </div>

                {candidate.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {candidate.description}
                  </p>
                )}

                <button
                  onClick={() => setVoteModal({ isOpen: true, candidate })}
                  disabled={!candidate.isActive}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {candidate.isActive ? 'Voter pour ce candidat' : 'Votes fermés'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vote Modal */}
      {voteModal.isOpen && voteModal.candidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Voter pour {voteModal.candidate.name}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleVote(voteModal.candidate!._id);
            }} className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom complet"
                value={voteData.customerName}
                onChange={(e) => setVoteData({...voteData, customerName: e.target.value})}
                required
                className="w-full rounded-md border-gray-300 shadow-sm"
              />
              
              <input
                type="email"
                placeholder="Votre email"
                value={voteData.email}
                onChange={(e) => setVoteData({...voteData, email: e.target.value})}
                required
                className="w-full rounded-md border-gray-300 shadow-sm"
              />
              
              <input
                type="tel"
                placeholder="Numéro de téléphone (+237...)"
                value={voteData.phoneNumber}
                onChange={(e) => setVoteData({...voteData, phoneNumber: e.target.value})}
                required
                className="w-full rounded-md border-gray-300 shadow-sm"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant du vote (FCFA)
                </label>
                <select
                  value={voteData.amount}
                  onChange={(e) => setVoteData({...voteData, amount: parseInt(e.target.value)})}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value={100}>100 FCFA (1 point)</option>
                  <option value={200}>200 FCFA (2 points)</option>
                  <option value={500}>500 FCFA (5 points)</option>
                  <option value={1000}>1000 FCFA (10 points)</option>
                  <option value={2000}>2000 FCFA (20 points)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement
                </label>
                <select
                  value={voteData.paymentMethod}
                  onChange={(e) => setVoteData({...voteData, paymentMethod: e.target.value as any})}
                  className="w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="MOMO">MTN Mobile Money</option>
                  <option value="OM">Orange Money</option>
                  <option value="MTN">MTN Money</option>
                  <option value="ORANGEMONEY">Orange Money</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setVoteModal({ isOpen: false })}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Confirmer le vote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Ticket Purchase Component
```typescript
// components/TicketPurchase.tsx
import { useState } from 'react';
import { apiClient } from '../lib/api';

interface TicketData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  situation: 'rouge' | 'bleu' | 'jaune';
  price: number;
  validDate: string;
  paymentMethod: 'MOMO' | 'OM' | 'MTN' | 'ORANGEMONEY';
}

export default function TicketPurchase() {
  const [ticketData, setTicketData] = useState<TicketData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    situation: 'rouge',
    price: 1000, // Fixed price in FCFA
    validDate: new Date().toISOString().split('T')[0], // Today as default
    paymentMethod: 'MOMO'
  });

  const [loading, setLoading] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    ticketNumber: string;
    paymentInstructions: string;
    txRef: string;
  } | null>(null);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/tickets/purchase', ticketData);
      const { ticketNumber, paymentInstructions, txRef } = response.data.data;
      
      setPurchaseResult({ ticketNumber, paymentInstructions, txRef });
      
    } catch (error) {
      console.error('Ticket purchase failed:', error);
      alert('Erreur lors de l\'achat du ticket. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (purchaseResult) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Achat de ticket initié!
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Numéro de ticket:</strong> {purchaseResult.ticketNumber}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Référence:</strong> {purchaseResult.txRef}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="font-medium text-blue-900 mb-2">Instructions de paiement:</h4>
              <p className="text-sm text-blue-800">{purchaseResult.paymentInstructions}</p>
            </div>
          </div>

          <button
            onClick={() => window.location.href = `/tickets/confirm?txRef=${purchaseResult.txRef}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Confirmer le paiement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Acheter un ticket
      </h2>

      <form onSubmit={handlePurchase} className="space-y-4">
        <input
          type="text"
          placeholder="Nom complet"
          value={ticketData.customerName}
          onChange={(e) => setTicketData({...ticketData, customerName: e.target.value})}
          required
          className="w-full rounded-md border-gray-300 shadow-sm"
        />

        <input
          type="email"
          placeholder="Email"
          value={ticketData.customerEmail}
          onChange={(e) => setTicketData({...ticketData, customerEmail: e.target.value})}
          required
          className="w-full rounded-md border-gray-300 shadow-sm"
        />

        <input
          type="tel"
          placeholder="Téléphone (+237...)"
          value={ticketData.customerPhone}
          onChange={(e) => setTicketData({...ticketData, customerPhone: e.target.value})}
          required
          className="w-full rounded-md border-gray-300 shadow-sm"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie de siège
          </label>
          <select
            value={ticketData.situation}
            onChange={(e) => setTicketData({...ticketData, situation: e.target.value as any})}
            className="w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="rouge">Zone Rouge</option>
            <option value="bleu">Zone Bleue</option>
            <option value="jaune">Zone Jaune</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'événement
          </label>
          <input
            type="date"
            value={ticketData.validDate}
            onChange={(e) => setTicketData({...ticketData, validDate: e.target.value})}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de paiement
          </label>
          <select
            value={ticketData.paymentMethod}
            onChange={(e) => setTicketData({...ticketData, paymentMethod: e.target.value as any})}
            className="w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="MOMO">MTN Mobile Money</option>
            <option value="OM">Orange Money</option>
            <option value="MTN">MTN Money</option>
            <option value="ORANGEMONEY">Orange Money</option>
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">Prix total:</span>
            <span className="text-xl font-bold text-green-600">
              {ticketData.price.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Achat en cours...' : `Acheter le ticket (${ticketData.price.toLocaleString()} FCFA)`}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Tous les tickets coûtent 1,000 FCFA indépendamment de la zone choisie
        </p>
      </div>
    </div>
  );
}
```

### 2. Vue.js/Nuxt.js Integration

#### API Plugin
```typescript
// plugins/api.ts (Nuxt 3)
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  const $api = $fetch.create({
    baseURL: config.public.apiBase || 'http://localhost:3000/api',
    onRequest({ request, options }) {
      // Add JWT token to headers
      const token = useCookie('wayback_jwt_token').value;
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        };
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // Redirect to login on unauthorized
        navigateTo('/login');
      }
    }
  });

  return {
    provide: {
      api: $api
    }
  };
});
```

#### Composable for Candidates
```typescript
// composables/useCandidates.ts
export const useCandidates = () => {
  const { $api } = useNuxtApp();

  const candidates = ref<Candidate[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCandidates = async (category?: 'miss' | 'master') => {
    try {
      loading.value = true;
      error.value = null;
      
      const endpoint = category ? `/candidates/category/${category}` : '/candidates';
      const response = await $api(endpoint);
      
      candidates.value = response.data;
    } catch (err) {
      error.value = 'Erreur lors du chargement des candidats';
      console.error('Failed to fetch candidates:', err);
    } finally {
      loading.value = false;
    }
  };

  const voteForCandidate = async (candidateId: string, voteData: VoteData) => {
    try {
      const response = await $api(`/candidates/${candidateId}/vote`, {
        method: 'POST',
        body: voteData
      });
      
      return response.data;
    } catch (err) {
      throw new Error('Erreur lors du vote');
    }
  };

  return {
    candidates: readonly(candidates),
    loading: readonly(loading),
    error: readonly(error),
    fetchCandidates,
    voteForCandidate
  };
};
```

## Data Models & TypeScript Interfaces

### Core Types
```typescript
// types/api.ts

// Conference Registration
export interface Registration {
  _id: string;
  registrationNumber: string;
  situation: 'rouge' | 'bleu' | 'jaune';
  nom: string;
  prenom: string;
  age: string;
  sexe: 'Homme' | 'Femme';
  numeroTelephone: string;
  email: string;
  quartier: string;
  statut: 'etudiant' | 'travailleur' | 'entrepreneur' | 'autre';
  organisation?: string;
  aDejaParticipe: 'oui' | 'non';
  nationalite: string;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

// Candidate
export interface Candidate {
  _id: string;
  name: string;
  category: 'miss' | 'master';
  ranking: number;
  image: string;
  sash: string;
  age: number;
  city: string;
  profession?: string;
  hobbies?: string[];
  description?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
  };
  isActive: boolean;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

// Vote
export interface Vote {
  _id: string;
  candidateId: string;
  voterPhone: string;
  voterEmail: string;
  voterName: string;
  paymentMethod: 'MOMO' | 'OM' | 'MTN' | 'ORANGEMONEY';
  amount: number;
  points: number;
  txRef: string;
  soleasPayReference?: string;
  soleasOrderId?: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  confirmedAt?: string;
}

// Ticket
export interface Ticket {
  _id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  situation: 'rouge' | 'bleu' | 'jaune';
  price: number;
  purchaseDate: string;
  validDate: string;
  qrCode: string;
  qrCodeImage?: string;
  paymentMethod: 'MOMO' | 'OM' | 'MTN' | 'ORANGEMONEY';
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  soleasPayReference?: string;
  soleasOrderId?: string;
  txRef: string;
  isValidated: boolean;
  validatedAt?: string;
  validatedBy?: string;
  validationLocation?: string;
  validationCount: number;
  secretHash: string;
  createdAt: string;
  updatedAt: string;
}

// Payment
export interface Payment {
  _id: string;
  txRef: string;
  flutterwaveId?: string;
  amount: number;
  currency: string;
  phoneNumber: string;
  network: 'MTN' | 'ORANGEMONEY';
  customerName: string;
  customerEmail: string;
  candidateId?: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';
  paymentLink?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "L'email est déjà utilisé pour une inscription existante",
  "statusCode": 400
}
```

### Common Error Codes
- `400` - Validation errors, malformed requests
- `401` - Authentication required
- `403` - Insufficient permissions
- `404` - Resource not found
- `409` - Conflict (duplicate registration)
- `429` - Rate limit exceeded
- `500` - Internal server error

### Frontend Error Handling
```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  switch (error.response?.status) {
    case 400:
      return 'Données invalides. Veuillez vérifier vos informations.';
    case 401:
      return 'Vous devez vous connecter pour accéder à cette fonctionnalité.';
    case 403:
      return 'Vous n\'avez pas les permissions nécessaires.';
    case 404:
      return 'Ressource non trouvée.';
    case 409:
      return 'Ces informations sont déjà utilisées.';
    case 429:
      return 'Trop de tentatives. Veuillez patienter avant de réessayer.';
    case 500:
      return 'Erreur serveur. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur inattendue s\'est produite.';
  }
};

// Usage in components
try {
  const response = await apiClient.post('/registrations', formData);
  // Handle success
} catch (error) {
  const errorMessage = handleApiError(error);
  setError(errorMessage);
}
```

## Security & Authentication

### JWT Token Management
```typescript
// utils/auth.ts
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('wayback_jwt_token', token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('wayback_jwt_token');
  },
  
  removeToken: () => {
    localStorage.removeItem('wayback_jwt_token');
  },
  
  isAuthenticated: (): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
};
```

## Performance Optimization

### Caching Strategy
```typescript
// utils/cache.ts
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlMinutes: number = 5) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

// Usage in API calls
const getCandidatesWithCache = async (category: string) => {
  const cacheKey = `candidates-${category}`;
  const cached = apiCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const response = await apiClient.get(`/candidates/category/${category}`);
  apiCache.set(cacheKey, response.data, 5); // Cache for 5 minutes
  
  return response.data;
};
```

## Testing

### API Testing with Jest
```typescript
// tests/api.test.ts
import { apiClient } from '../lib/api';

describe('WAYBack API Integration', () => {
  describe('Registration API', () => {
    it('should register a new user successfully', async () => {
      const registrationData = {
        situation: 'rouge',
        nom: 'Test',
        prenom: 'User',
        age: '25',
        sexe: 'Homme',
        numeroTelephone: '+237698123456',
        email: 'test@example.com',
        quartier: 'Test Quartier',
        statut: 'etudiant',
        aDejaParticipe: 'non',
        nationalite: 'Camerounaise'
      };

      const response = await apiClient.post('/registrations', registrationData);
      
      expect(response.data.success).toBe(true);
      expect(response.data.data.registrationNumber).toMatch(/^WAY\d{4}-\d{3}$/);
    });
  });

  describe('Candidates API', () => {
    it('should fetch candidates by category', async () => {
      const response = await apiClient.get('/candidates/category/miss');
      
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      
      if (response.data.data.length > 0) {
        expect(response.data.data[0]).toHaveProperty('_id');
        expect(response.data.data[0]).toHaveProperty('name');
        expect(response.data.data[0]).toHaveProperty('category', 'miss');
      }
    });
  });
});
```

## Deployment Notes

### Environment Variables
```bash
# Frontend Environment (.env.local)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=WAYBack 2025
NEXT_PUBLIC_CURRENCY=FCFA

# For SSR/Static Generation
API_URL=https://your-api-domain.com/api
```

### Build Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-api-domain.com', 'localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

This documentation provides complete frontend integration guidance for the MongoDB-powered WAYBack system. All Firebase dependencies have been removed and replaced with modern MongoDB-based APIs. The system now provides better performance, local currency support (FCFA), and simplified authentication with JWT tokens.