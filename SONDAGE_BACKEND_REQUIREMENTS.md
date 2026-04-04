# Backend Requirements for Sondage (Survey) Feature

## Overview
This document outlines the backend API requirements to support the What About You survey feature. The sondage collects feedback from 5 different participant categories with dynamic questionnaires.

---

## 📋 Table of Contents
1. [Data Structure](#data-structure)
2. [Required API Endpoints](#required-api-endpoints)
3. [Database Schema](#database-schema)
4. [Implementation Examples](#implementation-examples)
5. [Security Requirements](#security-requirements)
6. [Deployment Guide](#deployment-guide)

---

## 1. Data Structure

### Survey Response Object

```typescript
interface SurveyResponse {
  // Personal Information
  nom: string;                          // Last name (required)
  prenom: string;                       // First name (required)
  email: string;                        // Email address (required, validated)
  telephone: string;                    // Phone number (required)
  category: 'Exposant' | 'Participant étudiant' | 'Participant collégien' | 'Participant travailleur' | 'Participant partenaire';
  occupationDetails: string;            // Category-specific occupation (required)

  // General Information
  previousParticipation: 'Oui' | 'Non'; // Previous participation (required)

  // Category-Specific Responses (4 questions per category)
  categoryResponses: {
    q1: string;                         // Answer to question 1 (required)
    q2: string;                         // Answer to question 2 (required)
    q3: string;                         // Answer to question 3 (required)
    q4: string;                         // Answer to question 4 (required)
  };

  // General Suggestions
  plusGrandeForce: string;              // Greatest strength of WAY (required)
  pointAmeliorer: string;               // Point to improve (required)
  recommandation: 'Oui' | 'Peut-être' | 'Non'; // Would recommend (required)

  // System Fields
  submittedAt: string;                  // ISO 8601 timestamp
  id?: string;                          // Auto-generated on backend
}
```

### Category Types & Occupation Labels

| Category | Occupation Field Label |
|----------|------------------------|
| Exposant | Nom de votre entreprise/organisation |
| Participant étudiant | Domaine d'études |
| Participant collégien | Classe actuelle |
| Participant travailleur | Secteur d'activité professionnelle |
| Participant partenaire | Organisation/Structure partenaire |

---

## 2. Required API Endpoints

### 2.1 Submit Survey Response

**Endpoint:** `POST /api/surveys`

**Description:** Submit a new survey response

**Request Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "telephone": "695123456",
  "category": "Participant étudiant",
  "occupationDetails": "Informatique",
  "previousParticipation": "Non",
  "categoryResponses": {
    "q1": "5",
    "q2": "Les conférences et le networking",
    "q3": "Oui totalement",
    "q4": "Plus d'ateliers pratiques"
  },
  "plusGrandeForce": "L'organisation et la diversité des activités",
  "pointAmeliorer": "La communication avant l'événement",
  "recommandation": "Oui"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Sondage soumis avec succès",
  "data": {
    "id": "survey_abc123xyz",
    "submittedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Validation Rules:**
- All required fields must be present
- Email must be valid format
- Phone must be valid (Cameroon format preferred)
- Category must be one of the 5 valid options
- All category responses (q1-q4) must be provided
- Recommandation must be one of: 'Oui', 'Peut-être', 'Non'

**Rate Limiting:**
- Max 3 submissions per IP per hour
- Max 1 submission per email per day

---

### 2.2 Get All Survey Responses (Admin Only)

**Endpoint:** `GET /api/surveys`

**Description:** Retrieve all survey responses for admin dashboard

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50, max: 200)
- `category` (optional): Filter by category
- `sort` (optional): Sort order ('asc' or 'desc', default: 'desc')
- `search` (optional): Search by name or email

**Example Request:**
```
GET /api/surveys?page=1&limit=50&category=Participant%20étudiant&sort=desc
```

**Authentication:**
- Requires admin token in header: `Authorization: Bearer <admin_token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "surveys": [
      {
        "id": "survey_abc123xyz",
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@example.com",
        "telephone": "695123456",
        "category": "Participant étudiant",
        "occupationDetails": "Informatique",
        "previousParticipation": "Non",
        "categoryResponses": {
          "q1": "5",
          "q2": "Les conférences et le networking",
          "q3": "Oui totalement",
          "q4": "Plus d'ateliers pratiques"
        },
        "plusGrandeForce": "L'organisation",
        "pointAmeliorer": "La communication",
        "recommandation": "Oui",
        "submittedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 50,
      "totalPages": 3
    },
    "statistics": {
      "total": 150,
      "byCategory": {
        "Exposant": 20,
        "Participant étudiant": 60,
        "Participant collégien": 30,
        "Participant travailleur": 25,
        "Participant partenaire": 15
      },
      "recommendations": {
        "oui": 120,
        "peutEtre": 25,
        "non": 5
      }
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Admin authentication required"
}
```

---

### 2.3 Get Single Survey Response (Admin Only)

**Endpoint:** `GET /api/surveys/:id`

**Description:** Get a specific survey response by ID

**Authentication:** Admin token required

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "survey_abc123xyz",
    "nom": "Dupont",
    "prenom": "Jean",
    // ... full survey data
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Survey not found"
}
```

---

### 2.4 Get Survey Statistics (Admin Only)

**Endpoint:** `GET /api/surveys/statistics`

**Description:** Get aggregated statistics for dashboard

**Authentication:** Admin token required

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalResponses": 150,
    "byCategory": {
      "Exposant": 20,
      "Participant étudiant": 60,
      "Participant collégien": 30,
      "Participant travailleur": 25,
      "Participant partenaire": 15
    },
    "recommendations": {
      "oui": 120,
      "peutEtre": 25,
      "non": 5
    },
    "previousParticipation": {
      "oui": 45,
      "non": 105
    },
    "responsesOverTime": [
      { "date": "2025-01-15", "count": 25 },
      { "date": "2025-01-16", "count": 30 }
    ]
  }
}
```

---

### 2.5 Export Survey Data (Admin Only)

**Endpoint:** `GET /api/surveys/export`

**Description:** Export all survey responses as CSV or Excel

**Query Parameters:**
- `format`: 'csv' or 'xlsx' (default: 'csv')
- `category` (optional): Filter by category

**Authentication:** Admin token required

**Success Response (200 OK):**
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File download with survey data

---

## 3. Database Schema

### Option A: MongoDB Schema

```javascript
const surveySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  telephone: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Exposant',
      'Participant étudiant',
      'Participant collégien',
      'Participant travailleur',
      'Participant partenaire'
    ]
  },
  occupationDetails: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  previousParticipation: {
    type: String,
    required: true,
    enum: ['Oui', 'Non']
  },
  categoryResponses: {
    q1: { type: String, required: true },
    q2: { type: String, required: true },
    q3: { type: String, required: true },
    q4: { type: String, required: true }
  },
  plusGrandeForce: {
    type: String,
    required: true,
    trim: true
  },
  pointAmeliorer: {
    type: String,
    required: true,
    trim: true
  },
  recommandation: {
    type: String,
    required: true,
    enum: ['Oui', 'Peut-être', 'Non']
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
surveySchema.index({ email: 1 });
surveySchema.index({ category: 1 });
surveySchema.index({ createdAt: -1 });
surveySchema.index({ recommandation: 1 });

module.exports = mongoose.model('Survey', surveySchema);
```

### Option B: PostgreSQL Schema

```sql
CREATE TABLE surveys (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'Exposant',
    'Participant étudiant',
    'Participant collégien',
    'Participant travailleur',
    'Participant partenaire'
  )),
  occupation_details VARCHAR(200) NOT NULL,
  previous_participation VARCHAR(3) NOT NULL CHECK (previous_participation IN ('Oui', 'Non')),

  -- Category-specific responses (JSONB for flexibility)
  category_responses JSONB NOT NULL,

  plus_grande_force TEXT NOT NULL,
  point_ameliorer TEXT NOT NULL,
  recommandation VARCHAR(10) NOT NULL CHECK (recommandation IN ('Oui', 'Peut-être', 'Non')),

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_surveys_email ON surveys(email);
CREATE INDEX idx_surveys_category ON surveys(category);
CREATE INDEX idx_surveys_submitted_at ON surveys(submitted_at DESC);
CREATE INDEX idx_surveys_recommandation ON surveys(recommandation);

-- Constraint to prevent duplicate submissions from same email on same day
CREATE UNIQUE INDEX idx_surveys_email_date ON surveys(
  email,
  DATE(submitted_at)
);
```

---

## 4. Implementation Examples

### 4.1 Node.js + Express + MongoDB Implementation

**File: `backend/src/controllers/surveyController.js`**

```javascript
const Survey = require('../models/Survey');

// Submit a new survey
exports.submitSurvey = async (req, res) => {
  try {
    // Validate request body
    const {
      nom, prenom, email, telephone, category, occupationDetails,
      previousParticipation, categoryResponses, plusGrandeForce,
      pointAmeliorer, recommandation
    } = req.body;

    // Check if user already submitted today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingSubmission = await Survey.findOne({
      email,
      createdAt: { $gte: today }
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        error: 'Vous avez déjà soumis un sondage aujourd\'hui'
      });
    }

    // Create new survey
    const survey = new Survey({
      nom,
      prenom,
      email,
      telephone,
      category,
      occupationDetails,
      previousParticipation,
      categoryResponses,
      plusGrandeForce,
      pointAmeliorer,
      recommandation,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    await survey.save();

    res.status(201).json({
      success: true,
      message: 'Sondage soumis avec succès',
      data: {
        id: survey._id,
        submittedAt: survey.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting survey:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get all surveys (admin only)
exports.getAllSurveys = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const category = req.query.category;
    const search = req.query.search;
    const sort = req.query.sort === 'asc' ? 1 : -1;

    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { nom: new RegExp(search, 'i') },
        { prenom: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Get surveys with pagination
    const surveys = await Survey
      .find(query)
      .sort({ createdAt: sort })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Survey.countDocuments(query);

    // Get statistics
    const statistics = await getStatistics();

    res.json({
      success: true,
      data: {
        surveys,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        statistics
      }
    });

  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get survey statistics
async function getStatistics() {
  const [total, byCategory, recommendations, previousParticipation] = await Promise.all([
    Survey.countDocuments(),
    Survey.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]),
    Survey.aggregate([
      { $group: { _id: '$recommandation', count: { $sum: 1 } } }
    ]),
    Survey.aggregate([
      { $group: { _id: '$previousParticipation', count: { $sum: 1 } } }
    ])
  ]);

  return {
    total,
    byCategory: byCategory.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recommendations: {
      oui: recommendations.find(r => r._id === 'Oui')?.count || 0,
      peutEtre: recommendations.find(r => r._id === 'Peut-être')?.count || 0,
      non: recommendations.find(r => r._id === 'Non')?.count || 0
    },
    previousParticipation: {
      oui: previousParticipation.find(p => p._id === 'Oui')?.count || 0,
      non: previousParticipation.find(p => p._id === 'Non')?.count || 0
    }
  };
}

exports.getStatistics = async (req, res) => {
  try {
    const statistics = await getStatistics();
    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
```

**File: `backend/src/routes/surveys.js`**

```javascript
const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { authenticateAdmin } = require('../middleware/auth');
const { surveyRateLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/', surveyRateLimiter, surveyController.submitSurvey);

// Admin routes
router.get('/', authenticateAdmin, surveyController.getAllSurveys);
router.get('/statistics', authenticateAdmin, surveyController.getStatistics);

module.exports = router;
```

**File: `backend/src/middleware/rateLimiter.js`**

```javascript
const rateLimit = require('express-rate-limit');

// Rate limiter for survey submissions
exports.surveyRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    success: false,
    error: 'Trop de tentatives. Veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

**File: `backend/src/middleware/auth.js`**

```javascript
const jwt = require('jsonwebtoken');

exports.authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Admin authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};
```

**File: `backend/server.js`**

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const surveyRoutes = require('./src/routes/surveys');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:6501',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (important for rate limiting and IP tracking)
app.set('trust proxy', 1);

// Routes
app.use('/api/surveys', surveyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
```

**File: `backend/.env`**

```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:6501

# Database
MONGODB_URI=mongodb://localhost:27017/whataboutyou
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whataboutyou

# JWT Secret for Admin Authentication
JWT_SECRET=your-very-secure-random-secret-key-change-this

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=3
```

**File: `backend/package.json`**

```json
{
  "name": "whataboutyou-backend",
  "version": "1.0.0",
  "description": "Backend API for What About You survey system",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 5. Security Requirements

### 5.1 Essential Security Measures

1. **Input Validation**
   - Sanitize all user inputs
   - Validate email format
   - Check phone number format
   - Limit string lengths
   - Validate enum values

2. **Rate Limiting**
   - 3 submissions per IP per hour
   - 1 submission per email per day
   - Admin endpoints: 100 requests per 15 minutes

3. **CORS Configuration**
   - Whitelist frontend domain only
   - No wildcard origins in production

4. **Headers Security**
   - Use helmet.js for security headers
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Content-Security-Policy

5. **Admin Authentication**
   - JWT tokens with expiration
   - Secure token storage
   - Role-based access control

6. **Data Protection**
   - Hash sensitive data
   - HTTPS only in production
   - Secure database connection strings
   - Environment variables for secrets

7. **SQL Injection Prevention**
   - Use parameterized queries
   - ORM/ODM for database operations
   - Never concatenate user input in queries

8. **XSS Prevention**
   - Sanitize output
   - Content Security Policy headers
   - Escape HTML in responses

---

## 6. Deployment Guide

### Option A: Deploy to Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize:**
```bash
railway login
railway init
```

3. **Add MongoDB:**
```bash
railway add mongodb
```

4. **Set Environment Variables:**
```bash
railway variables set MONGODB_URI=${{MONGOURL}}
railway variables set JWT_SECRET=your-secret-key
railway variables set FRONTEND_URL=https://your-frontend.com
```

5. **Deploy:**
```bash
railway up
```

### Option B: Deploy to Render

1. **Create `render.yaml`:**
```yaml
services:
  - type: web
    name: whataboutyou-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://your-frontend.com
```

2. **Connect Repository**
   - Push code to GitHub
   - Connect Render to repository
   - Auto-deploy on push

### Option C: Deploy to Vercel (Serverless)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Create `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "JWT_SECRET": "@jwt-secret",
    "FRONTEND_URL": "https://your-frontend.com"
  }
}
```

3. **Deploy:**
```bash
vercel --prod
```

---

## 7. Testing the Backend

### 7.1 Test Survey Submission with cURL

```bash
curl -X POST http://localhost:5000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@example.com",
    "telephone": "695123456",
    "category": "Participant étudiant",
    "occupationDetails": "Informatique",
    "previousParticipation": "Non",
    "categoryResponses": {
      "q1": "5",
      "q2": "Les conférences",
      "q3": "Oui totalement",
      "q4": "Plus d ateliers"
    },
    "plusGrandeForce": "Organisation",
    "pointAmeliorer": "Communication",
    "recommandation": "Oui"
  }'
```

### 7.2 Test Admin Endpoint

```bash
curl -X GET http://localhost:5000/api/surveys \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 8. Frontend Integration Changes

Once your backend is ready, update the frontend:

**File: `src/services/surveyService.ts`** (NEW FILE)

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SurveyData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  category: string;
  occupationDetails: string;
  previousParticipation: string;
  categoryResponses: Record<string, string>;
  plusGrandeForce: string;
  pointAmeliorer: string;
  recommandation: string;
}

export const submitSurvey = async (data: SurveyData) => {
  try {
    const response = await axios.post(`${API_URL}/surveys`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
      'Une erreur s\'est produite lors de l\'envoi du sondage'
    );
  }
};

export const getAllSurveys = async (adminToken: string, params?: any) => {
  try {
    const response = await axios.get(`${API_URL}/surveys`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      },
      params
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
      'Erreur lors de la récupération des sondages'
    );
  }
};

export const getSurveyStatistics = async (adminToken: string) => {
  try {
    const response = await axios.get(`${API_URL}/surveys/statistics`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
      'Erreur lors de la récupération des statistiques'
    );
  }
};
```

**Update `src/pages/SondagePage.tsx`:**

```typescript
// REPLACE THIS:
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

// WITH THIS:
import { submitSurvey } from '../services/surveyService';

// THEN UPDATE handleSubmit function:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    // Submit to backend API instead of Firebase
    await submitSurvey(formData);
    setCurrentStep('success');
  } catch (err: any) {
    console.error('Error submitting survey:', err);
    setError(err.message || 'Une erreur s\'est produite lors de l\'envoi du sondage. Veuillez réessayer.');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Update frontend `.env`:**

```env
VITE_API_URL=http://localhost:5000/api
# OR for production:
# VITE_API_URL=https://your-backend.railway.app/api
```

---

## 9. Next Steps

### Immediate Actions:

1. ✅ Choose your backend stack (Node.js + Express recommended)
2. ✅ Set up MongoDB database (local or Atlas)
3. ✅ Install dependencies and create backend files
4. ✅ Test locally with the provided examples
5. ✅ Deploy backend to Railway/Render/Vercel
6. ✅ Update frontend to use backend API
7. ✅ Set up admin authentication
8. ✅ Test end-to-end flow

### Optional Enhancements:

- Email notifications when survey is submitted
- CSV/Excel export functionality
- Real-time dashboard updates with WebSockets
- Advanced analytics and charts
- Data backup and archiving
- GDPR compliance features (data deletion, export)

---

## 10. Cost Estimates

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Railway** | $5 credit/month | $5-20/month |
| **Render** | 750 hours/month | $7/month |
| **MongoDB Atlas** | 512MB storage | $9/month |
| **Vercel** | Unlimited | $20/month (Pro) |

**Recommended Setup for Production:**
- Railway Web Service: $5-10/month
- MongoDB Atlas Shared Cluster: Free or $9/month
- **Total: $5-19/month**

---

## Support

Need help implementing? Check:
- Express.js docs: https://expressjs.com
- MongoDB docs: https://docs.mongodb.com
- Railway docs: https://docs.railway.app
- Render docs: https://render.com/docs

---

**Document Version:** 1.0
**Last Updated:** 2025-01-15
**Author:** Claude Code Assistant
