# Sondage Implementation - What About You

## Overview
This document describes the implementation of the survey (sondage) feature for the What About You event platform. The survey replaces the "Achetez votre ticket" button and collects comprehensive feedback from participants.

## Features Implemented

### 1. Survey Page (`/sondage`)
A multi-step survey form that collects:
- Personal information (name, email, phone, category, occupation)
- General information (previous participation)
- Category-specific feedback based on user type
- General suggestions

### 2. User Categories & Dynamic Questions
The survey adapts to 5 different participant categories:

#### Exposant (Exhibitor)
- Organization quality evaluation
- Visibility assessment
- Difficulties encountered
- Improvement suggestions

#### Participant étudiant (Student)
- Event organization rating (1-5 scale)
- Most appreciated aspects
- Career orientation impact
- Improvement suggestions

#### Participant collégien (College Student)
- Content appropriateness
- Favorite activities
- Career discovery impact
- Future improvements

#### Participant travailleur (Professional)
- Professional development relevance
- Networking opportunities
- Most impactful aspects
- Suggestions for professionals

#### Participant partenaire (Partner)
- Visibility assessment
- Objectives achievement
- Best-performing devices/spaces
- Partner-specific suggestions

### 3. Admin Panel Integration
A comprehensive admin dashboard to view and analyze survey responses:

**Statistics Dashboard:**
- Total responses count
- Recommendation breakdown (Oui/Peut-être/Non)
- Category distribution

**Response Management:**
- Search by name, email
- Filter by category
- Detailed view of individual responses
- Export-ready data structure

**Access:** Available at `/admin` → "Sondages" tab

### 4. Firebase Integration
Survey responses are stored in Firebase Firestore:
- Collection: `surveys`
- Real-time data synchronization
- Scalable storage solution

## File Structure

```
src/
├── pages/
│   └── SondagePage.tsx              # Main survey page with multi-step form
├── pages/admin/
│   ├── AdminPage.tsx                # Updated with surveys tab
│   └── components/
│       └── SurveyResponses.tsx      # Admin survey viewer component
├── components/
│   └── HeroSection.tsx              # Updated button (Sondage instead of ticket)
├── services/
│   └── firebase.ts                  # Firebase configuration
└── AppHash.tsx                       # Updated with /sondage route
```

## Setup Instructions

### 1. Firebase Configuration

Create a Firebase project and update `src/services/firebase.ts` with your credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Or use environment variables in `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. Firestore Security Rules

Update Firebase Firestore rules to allow survey submissions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create surveys
    match /surveys/{surveyId} {
      allow create: if request.resource.data.keys().hasAll([
        'nom', 'prenom', 'email', 'telephone', 'category'
      ]);

      // Only authenticated admins can read
      allow read: if request.auth != null;
    }
  }
}
```

### 3. Required Indexes

Create a composite index in Firestore:
- Collection: `surveys`
- Fields: `submittedAt` (Descending)

### 4. Installation

The Firebase package has already been installed:

```bash
npm install firebase
```

## Usage

### For Users

1. Visit the homepage
2. Click the "SONDAGE" button in the hero section
3. Fill in personal information
4. Answer category-specific questions
5. Provide general feedback
6. Submit

### For Admins

1. Navigate to `/admin`
2. Login with admin credentials
3. Click "Sondages" tab
4. View statistics and responses
5. Use search/filter to find specific responses
6. Click "Voir détails" to view full responses

## Data Structure

### Survey Response Object

```typescript
{
  id: string;                          // Auto-generated
  nom: string;                         // Last name
  prenom: string;                      // First name
  email: string;                       // Email address
  telephone: string;                   // Phone number
  category: string;                    // User category
  occupationDetails: string;           // Category-specific occupation
  previousParticipation: 'Oui' | 'Non'; // Previous participation
  categoryResponses: {                 // Category-specific answers
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  plusGrandeForce: string;            // Greatest strength
  pointAmeliorer: string;             // Point to improve
  recommandation: 'Oui' | 'Peut-être' | 'Non'; // Recommendation
  submittedAt: string;                // ISO timestamp
}
```

## Features

### User Experience
- Multi-step form with progress indicator
- Validation on each step
- Responsive design
- Category-based occupation fields:
  - Exposant → Company name
  - Étudiant → Field of study
  - Collégien → Current class
  - Travailleur → Professional sector
  - Partenaire → Partner organization

### Admin Features
- Real-time statistics
- Color-coded categories
- Search functionality
- Filter by category
- Detailed response modal
- Recommendation tracking

### Data Validation
- Required fields enforcement
- Email format validation
- Phone number validation
- Category-specific question requirements

## Technical Details

### Technologies Used
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Firebase Firestore** - Database
- **TailwindCSS** - Styling
- **React Router** - Navigation

### Performance Considerations
- Lazy loading of admin components
- Optimized Firebase queries
- Indexed Firestore collection
- Client-side caching

## Next Steps

1. **Setup Firebase:**
   - Create Firebase project
   - Configure Firestore database
   - Set security rules
   - Add indexes

2. **Test the Feature:**
   - Submit test surveys
   - Verify data in Firestore
   - Check admin panel display
   - Test search/filter functionality

3. **Optional Enhancements:**
   - Export responses to CSV/Excel
   - Email notifications for new responses
   - Response analytics charts
   - Automated reports

## Support

For issues or questions:
1. Check Firebase Console for errors
2. Verify Firestore security rules
3. Check browser console for errors
4. Ensure Firebase credentials are correct

## Security Notes

- Survey submissions are public (no authentication required)
- Admin access requires authentication
- Firestore rules prevent unauthorized access
- Personal data is stored securely in Firebase
- Consider GDPR compliance for production use

## Changelog

**Version 1.0** (Current)
- ✅ Multi-step survey form
- ✅ 5 category-specific question sets
- ✅ Firebase integration
- ✅ Admin dashboard
- ✅ Statistics and analytics
- ✅ Search and filter
- ✅ Hero button updated to "Sondage"
