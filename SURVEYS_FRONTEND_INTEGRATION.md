# Survey Feature - Frontend Integration with Backend API

## Overview
The frontend survey feature has been successfully integrated with the WAYBack backend API. The application now submits surveys to the backend API instead of directly to Firebase, giving you benefits like rate limiting, duplicate prevention, and better validation.

## Changes Made

### 1. New Service File: `src/services/surveyService.ts`
Created a comprehensive service to handle all survey-related API calls:
- `submitSurvey()` - Submit survey responses to the backend
- `getAllSurveys()` - Fetch all surveys with pagination and filtering (Admin)
- `getSurveyStatistics()` - Get survey statistics (Admin)
- `getSurveyById()` - Get a specific survey by ID (Admin)

**Features:**
- Automatic API URL configuration from environment variables
- Error handling with French error messages
- TypeScript interfaces for type safety
- Rate limit detection (429 status code)
- Validation error handling

### 2. Updated `.env.example`
Added backend API URL configuration:
```env
VITE_API_URL=https://api.whataboutyou.net/api
```

**Environments:**
- **Production:** `https://api.whataboutyou.net/api`
- **Local Development:** `http://localhost:3200/api`

### 3. Updated `src/pages/SondagePage.tsx`
**Changes:**
- Removed direct Firebase imports (`collection`, `addDoc`)
- Now uses `submitSurvey()` from surveyService
- Improved error handling with backend error messages
- Properly formats data to match backend API schema

**Benefits:**
- Rate limiting: 3 submissions per hour per IP
- Duplicate prevention: 1 submission per email per day
- Server-side validation with French error messages
- Better error feedback to users

### 4. Updated `src/pages/admin/components/SurveyResponses.tsx`
**Changes:**
- Removed direct Firebase queries
- Now uses `getAllSurveys()` and `getSurveyStatistics()` from surveyService
- Real-time filtering via API (search and category filter)
- Added error state with retry functionality
- Statistics fetched from backend endpoint

**Features:**
- Paginated responses (200 per page for admin)
- Server-side search and filtering
- Error handling with retry button
- Statistics dashboard powered by backend

## Setup Instructions

### Step 1: Create `.env` File
Copy `.env.example` to `.env` in the project root:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### Step 2: Configure Environment Variables
Edit `.env` and set your backend API URL:

**For Production:**
```env
VITE_API_URL=https://api.whataboutyou.net/api
```

**For Local Development:**
```env
VITE_API_URL=http://localhost:3200/api
```

### Step 3: Install Dependencies (if needed)
```bash
npm install
```

Axios is already included in `package.json`.

### Step 4: Build and Run
```bash
# Development
npm run dev

# Production build
npm run build
```

## API Endpoints Used

### Public Endpoint (No Authentication Required)

#### POST `/api/surveys` - Submit Survey
**Rate Limit:** 3 requests per hour per IP
**Duplicate Prevention:** 1 submission per email per day

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
    "q2": "Les conférences",
    "q3": "Oui totalement",
    "q4": "Plus d'ateliers"
  },
  "plusGrandeForce": "L'organisation",
  "pointAmeliorer": "La communication",
  "recommandation": "Oui"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Sondage soumis avec succès",
  "data": {
    "id": "abc123",
    "submittedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

1. **Duplicate Submission (400):**
```json
{
  "statusCode": 400,
  "message": "Vous avez déjà soumis un sondage aujourd'hui"
}
```

2. **Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": [
    "L'email est requis",
    "Le nom ne peut pas dépasser 100 caractères"
  ],
  "error": "Bad Request"
}
```

3. **Rate Limit (429):**
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

### Admin Endpoints (⚠️ TODO: Add Authentication)

#### GET `/api/surveys` - Get All Surveys
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50, max: 200)
- `category` (filter by category)
- `search` (search by name/email)
- `sort` ('asc' or 'desc', default: 'desc')

**Response:**
```json
{
  "success": true,
  "data": {
    "surveys": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

#### GET `/api/surveys/statistics` - Get Statistics
**Response:**
```json
{
  "success": true,
  "data": {
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
    },
    "previousParticipation": {
      "oui": 45,
      "non": 105
    }
  }
}
```

#### GET `/api/surveys/:id` - Get Single Survey
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "nom": "Dupont",
    "prenom": "Jean",
    ...
  }
}
```

## Testing the Integration

### Test Survey Submission

1. **Start the development server:**
```bash
npm run dev
```

2. **Navigate to the survey page:**
```
http://localhost:6500/#/sondage
```

3. **Fill in the form:**
   - Personal information
   - Category selection
   - Previous participation
   - Category-specific questions
   - General suggestions

4. **Submit the form**

5. **Expected Results:**
   - Success message appears
   - Survey is saved to backend database
   - Rate limiting prevents multiple submissions
   - Duplicate email detection works

### Test Admin Panel

1. **Navigate to admin page:**
```
http://localhost:6500/#/admin
```

2. **Login with admin credentials**

3. **Click "Sondages" tab**

4. **Verify:**
   - Statistics cards show correct numbers
   - Category breakdown displays properly
   - Survey list appears
   - Search and filter work
   - Details modal opens correctly

### Test Error Handling

1. **Test Rate Limiting:**
   - Submit 4 surveys quickly from the same IP
   - 4th submission should show rate limit error

2. **Test Duplicate Prevention:**
   - Submit survey with same email twice in one day
   - 2nd submission should show duplicate error

3. **Test Validation:**
   - Try submitting with missing fields
   - Should show validation errors in French

## Backend API Features

### Rate Limiting
- **Limit:** 3 submissions per hour per IP
- **Purpose:** Prevent spam and abuse
- **Implementation:** NestJS Throttler module

### Duplicate Prevention
- **Rule:** 1 submission per email per day
- **Purpose:** Prevent duplicate responses
- **Implementation:** Firestore query with date filter

### Validation
- **Server-side validation** with class-validator
- **French error messages** for user-friendly feedback
- **Field validations:**
  - Required fields enforcement
  - String length limits (nom: 100, prenom: 100)
  - Email format validation
  - Enum validation for categories

### Data Tracking
- **IP Address:** Captured for rate limiting
- **User Agent:** Stored for analytics
- **Timestamps:** submittedAt, createdAt, updatedAt

## Troubleshooting

### Issue: "Network Error" or "Failed to fetch"

**Cause:** Backend API is not accessible

**Solutions:**
1. Verify backend is running:
```bash
# SSH into your server
pm2 status

# Should see "whataboutyou-backend" running on port 3200
```

2. Check Nginx configuration:
```bash
sudo nginx -t
sudo systemctl status nginx
```

3. Verify API URL in `.env`:
```env
VITE_API_URL=https://api.whataboutyou.net/api
```

4. Test API directly:
```bash
curl https://api.whataboutyou.net/api/surveys/statistics
```

### Issue: CORS Error

**Cause:** Backend CORS not configured for frontend domain

**Solution:** Update backend CORS configuration in `main.ts`:
```typescript
app.enableCors({
  origin: ['https://whataboutyou.net', 'http://localhost:6500'],
  credentials: true,
});
```

### Issue: Rate Limit Errors

**Cause:** Too many submissions from same IP

**Solutions:**
1. Wait 1 hour before retrying
2. For testing, increase rate limit in backend:
```typescript
// src/surveys/surveys.controller.ts
@Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 per hour
```

### Issue: Admin Panel Shows Empty

**Cause:** Authentication not implemented or API errors

**Solutions:**
1. Check browser console for errors
2. Verify backend is returning data:
```bash
curl https://api.whataboutyou.net/api/surveys
```
3. Implement authentication guards (TODO)

## Next Steps

### 1. Implement Admin Authentication
Currently, admin endpoints are not protected. Add authentication:

**Option A: Use JWT Guard**
```typescript
// src/surveys/surveys.controller.ts
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Get()
@UseGuards(JwtAuthGuard)
async findAll() { ... }
```

**Option B: Create Admin Guard**
```typescript
import { AdminGuard } from '../auth/guards/admin.guard';

@Get()
@UseGuards(JwtAuthGuard, AdminGuard)
async findAll() { ... }
```

### 2. Add Export to CSV/Excel
Allow admins to export survey data:
```typescript
// Add endpoint in backend
@Get('export')
async exportToCSV() { ... }
```

### 3. Email Notifications
Send email when new survey is submitted:
```typescript
// In surveys.service.ts
await this.emailService.sendNewSurveyNotification(survey);
```

### 4. Real-time Updates (Optional)
Use WebSockets for real-time survey count updates in admin panel.

## File Structure

```
whataboutyou-master/
├── src/
│   ├── services/
│   │   └── surveyService.ts           ✨ NEW - API integration
│   ├── pages/
│   │   ├── SondagePage.tsx            ✅ UPDATED - Uses API
│   │   └── admin/
│   │       └── components/
│   │           └── SurveyResponses.tsx ✅ UPDATED - Uses API
├── .env                                ✅ NEW - Add this file
├── .env.example                        ✅ UPDATED - Added API_URL
├── SURVEYS_FRONTEND_INTEGRATION.md     ✨ NEW - This file
└── SURVEYS_IMPLEMENTATION.md           📄 Backend docs (from WAYBack)
```

## Summary

✅ **Completed:**
- Created `surveyService.ts` for API integration
- Updated `SondagePage.tsx` to use backend API
- Updated `SurveyResponses.tsx` to fetch from backend
- Added environment variable configuration
- Implemented error handling
- Added TypeScript types

✅ **Benefits:**
- Rate limiting (3 per hour per IP)
- Duplicate prevention (1 per email per day)
- Server-side validation
- Better error messages
- Centralized data management
- Statistics endpoint

⚠️ **Pending:**
- Admin authentication guards
- CSV/Excel export
- Email notifications
- Real-time updates (optional)

## Contact & Support

**Backend API:** `https://api.whataboutyou.net/api`
**Frontend:** `https://whataboutyou.net`
**Port:** 3200 (proxied via Nginx)
**PM2 Process:** whataboutyou-backend (ID: 8)

For issues or questions, refer to the backend documentation in `SURVEYS_IMPLEMENTATION.md` from the WAYBack repository.

---

**Integration Date:** 2025-11-13
**Status:** ✅ Ready for Testing
**Next Steps:** Test submission and add admin authentication
