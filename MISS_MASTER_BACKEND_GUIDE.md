# Miss & Master Competition Backend Architecture Guide

## Overview

Based on the frontend CandidatesSection component analysis, this guide provides a comprehensive backend architecture for the Miss & Master competition system with voting functionality.

## 1. Database Entities

### Candidate Entity

```typescript
// entities/Candidate.ts
export interface Candidate {
  id: number;
  name: string;
  category: 'miss' | 'master';
  ranking: number;
  points: number;
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
  createdAt: Date;
  updatedAt: Date;
}
```

### Vote Entity

```typescript
// entities/Vote.ts
export interface Vote {
  id: number;
  candidateId: number;
  voterPhoneNumber: string;
  paymentMethod: 'Orange CM' | 'MTN CM' | 'Moov CM';
  amount: number;
  points: number; // amount / 500 (500 FCFA = 1 point)
  transactionId?: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  confirmedAt?: Date;
}
```

### Payment Transaction Entity

```typescript
// entities/PaymentTransaction.ts
export interface PaymentTransaction {
  id: number;
  voteId: number;
  externalTransactionId: string;
  paymentProvider: string;
  amount: number;
  currency: 'XAF';
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  providerResponse?: any;
  webhookData?: any;
  createdAt: Date;
  updatedAt: Date;
}
```

## 2. Data Transfer Objects (DTOs)

### Request DTOs

```typescript
// dto/requests/CreateVoteRequest.ts
export interface CreateVoteRequest {
  candidateId: number;
  phoneNumber: string;
  paymentMethod: 'Orange CM' | 'MTN CM' | 'Moov CM';
  amount: number;
}

// dto/requests/UpdateCandidateRequest.ts
export interface UpdateCandidateRequest {
  name?: string;
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
  isActive?: boolean;
}

// dto/requests/CreateCandidateRequest.ts
export interface CreateCandidateRequest {
  name: string;
  category: 'miss' | 'master';
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
}
```

### Response DTOs

```typescript
// dto/responses/CandidateResponse.ts
export interface CandidateResponse {
  id: number;
  name: string;
  category: 'miss' | 'master';
  ranking: number;
  points: number;
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
}

// dto/responses/VoteResponse.ts
export interface VoteResponse {
  id: number;
  candidateId: number;
  candidateName: string;
  points: number;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

// dto/responses/VotingStatsResponse.ts
export interface VotingStatsResponse {
  totalVotes: number;
  totalAmount: number;
  totalVoters: number;
  topCandidates: Array<{
    candidateId: number;
    name: string;
    totalPoints: number;
    totalVotes: number;
    ranking: number;
  }>;
}

// dto/responses/PaymentInitResponse.ts
export interface PaymentInitResponse {
  voteId: number;
  paymentUrl?: string;
  paymentReference: string;
  instructions: string;
  expiresAt: string;
}
```

## 3. Controller Endpoints

### Candidates Controller

```typescript
// controllers/CandidatesController.ts

// GET /api/candidates
export async function getAllCandidates(
  category?: 'miss' | 'master',
  limit?: number,
  offset?: number
): Promise<CandidateResponse[]>

// GET /api/candidates/:id
export async function getCandidateById(id: number): Promise<CandidateResponse>

// GET /api/candidates/rankings
export async function getCandidateRankings(
  category?: 'miss' | 'master'
): Promise<CandidateResponse[]>

// POST /api/candidates (Admin only)
export async function createCandidate(
  request: CreateCandidateRequest
): Promise<CandidateResponse>

// PUT /api/candidates/:id (Admin only)
export async function updateCandidate(
  id: number,
  request: UpdateCandidateRequest
): Promise<CandidateResponse>

// DELETE /api/candidates/:id (Admin only)
export async function deleteCandidate(id: number): Promise<void>

// POST /api/candidates/:id/recalculate-points (Admin only)
export async function recalculateCandidatePoints(id: number): Promise<CandidateResponse>
```

### Voting Controller

```typescript
// controllers/VotingController.ts

// POST /api/votes
export async function createVote(
  request: CreateVoteRequest
): Promise<PaymentInitResponse>

// GET /api/votes/:id
export async function getVote(id: number): Promise<VoteResponse>

// POST /api/votes/:id/confirm
export async function confirmVote(
  id: number,
  transactionId: string
): Promise<VoteResponse>

// GET /api/votes/candidate/:candidateId
export async function getVotesByCandidate(
  candidateId: number,
  limit?: number,
  offset?: number
): Promise<VoteResponse[]>

// GET /api/votes/stats
export async function getVotingStats(): Promise<VotingStatsResponse>

// POST /api/votes/webhook/payment (Webhook endpoint)
export async function handlePaymentWebhook(
  provider: string,
  payload: any
): Promise<void>
```

### Admin Controller

```typescript
// controllers/AdminController.ts

// GET /api/admin/votes
export async function getAllVotes(
  status?: string,
  candidateId?: number,
  limit?: number,
  offset?: number
): Promise<VoteResponse[]>

// GET /api/admin/analytics
export async function getAnalytics(): Promise<{
  totalRevenue: number;
  totalVotes: number;
  totalVoters: number;
  votingTrends: any[];
  paymentMethodStats: any[];
}>

// POST /api/admin/votes/:id/refund
export async function refundVote(id: number): Promise<VoteResponse>

// PUT /api/admin/candidates/:id/ranking
export async function updateCandidateRanking(
  id: number,
  newRanking: number
): Promise<CandidateResponse>
```

## 4. Service Layer

### Candidate Service

```typescript
// services/CandidateService.ts

export class CandidateService {
  // Core candidate operations
  async findAll(category?: string): Promise<Candidate[]>
  async findById(id: number): Promise<Candidate>
  async create(data: CreateCandidateRequest): Promise<Candidate>
  async update(id: number, data: UpdateCandidateRequest): Promise<Candidate>
  async delete(id: number): Promise<void>
  
  // Ranking and points management
  async recalculatePoints(candidateId: number): Promise<Candidate>
  async updateRankings(category?: string): Promise<void>
  async getRankings(category?: string): Promise<Candidate[]>
  
  // Statistics
  async getCandidateStats(candidateId: number): Promise<{
    totalVotes: number;
    totalPoints: number;
    averageVoteAmount: number;
    rankingHistory: any[];
  }>
}
```

### Voting Service

```typescript
// services/VotingService.ts

export class VotingService {
  // Vote creation and management
  async createVote(data: CreateVoteRequest): Promise<Vote>
  async confirmVote(voteId: number, transactionId: string): Promise<Vote>
  async cancelVote(voteId: number): Promise<Vote>
  
  // Payment integration
  async initiatePayment(vote: Vote): Promise<PaymentInitResponse>
  async processPaymentWebhook(provider: string, payload: any): Promise<void>
  
  // Vote validation
  async validateVoteRequest(data: CreateVoteRequest): Promise<void>
  async checkDuplicateVote(phoneNumber: string, candidateId: number): Promise<boolean>
  
  // Statistics and analytics
  async getVotingStats(): Promise<VotingStatsResponse>
  async getVotesByCandidate(candidateId: number): Promise<Vote[]>
  async getVotingTrends(): Promise<any[]>
}
```

### Payment Service

```typescript
// services/PaymentService.ts

export class PaymentService {
  // Provider-specific implementations
  async initializeOrangePayment(vote: Vote): Promise<PaymentTransaction>
  async initializeMTNPayment(vote: Vote): Promise<PaymentTransaction>
  async initializeMoovPayment(vote: Vote): Promise<PaymentTransaction>
  
  // Payment status management
  async checkPaymentStatus(transactionId: string): Promise<string>
  async confirmPayment(transactionId: string): Promise<PaymentTransaction>
  async refundPayment(transactionId: string): Promise<PaymentTransaction>
  
  // Webhook processing
  async processOrangeWebhook(payload: any): Promise<void>
  async processMTNWebhook(payload: any): Promise<void>
  async processMoovWebhook(payload: any): Promise<void>
}
```

### Notification Service

```typescript
// services/NotificationService.ts

export class NotificationService {
  // SMS notifications
  async sendVoteConfirmationSMS(phoneNumber: string, candidate: Candidate, points: number): Promise<void>
  async sendPaymentInstructionsSMS(phoneNumber: string, instructions: string): Promise<void>
  
  // Email notifications (for admin)
  async sendVoteNotificationEmail(vote: Vote): Promise<void>
  async sendDailySummaryEmail(stats: VotingStatsResponse): Promise<void>
  
  // Real-time updates
  async broadcastRankingUpdate(candidateId: number, newRanking: number): Promise<void>
  async broadcastVoteUpdate(vote: Vote): Promise<void>
}
```

## 5. Implementation Steps

### Phase 1: Core Infrastructure
1. Set up database schema with migrations
2. Implement entity models with relationships
3. Create basic CRUD operations for candidates
4. Set up authentication and authorization middleware

### Phase 2: Voting System
1. Implement vote creation and validation logic
2. Add payment provider integration (start with one provider)
3. Create webhook endpoints for payment confirmation
4. Implement points calculation and ranking updates

### Phase 3: Advanced Features
1. Add real-time updates with WebSocket/SSE
2. Implement SMS notifications
3. Create admin analytics dashboard
4. Add fraud detection and rate limiting

### Phase 4: Production Ready
1. Add comprehensive error handling
2. Implement caching layer (Redis)
3. Add monitoring and logging
4. Performance optimization and load testing

## 6. Security Considerations

### Vote Security
- Rate limiting per phone number (max 5 votes per hour)
- IP-based fraud detection
- Payment transaction verification
- Duplicate vote prevention

### Data Protection
- Phone number hashing for privacy
- Secure payment provider integration
- HTTPS for all API endpoints
- Input validation and sanitization

### Admin Security
- JWT-based authentication
- Role-based access control
- API key authentication for webhooks
- Audit logging for all admin actions

## 7. Technical Stack Recommendations

### Backend Framework
- **Node.js + Express.js** or **NestJS** (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session and ranking cache
- **Queue**: Bull/BullMQ for background job processing

### Payment Integration
- Orange Money API
- MTN Mobile Money API  
- Moov Money API
- Webhook signature verification

### Infrastructure
- **Hosting**: Railway, Vercel, or Google Cloud Run
- **Database**: Railway PostgreSQL or Google Cloud SQL
- **File Storage**: Cloudinary for candidate images
- **Monitoring**: Sentry for error tracking

## 8. API Documentation

Generate comprehensive API documentation using:
- **Swagger/OpenAPI** for REST endpoints
- **Postman Collections** for testing
- **TypeScript interfaces** for type safety

This architecture provides a robust foundation for the Miss & Master competition voting system with scalability, security, and maintainability in mind.