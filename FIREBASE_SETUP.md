# Firebase Setup Guide for Conference Registration

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `whataboutyou-conference` (or your choice)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users (e.g., `europe-west3` for Africa/Europe)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Web" icon `</>`
4. Register your app name: "What About You Frontend"
5. Copy the configuration object
6. Replace the values in `src/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Your actual API key
  authDomain: "whataboutyou-conference.firebaseapp.com",
  projectId: "whataboutyou-conference",
  storageBucket: "whataboutyou-conference.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Step 4: Generate Admin SDK Key (for Backend)

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Keep this file secure - you'll need it for your backend

## Step 5: Set Up Authentication (Optional but Recommended)

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Add authorized domains if needed

## Step 6: Configure Security Rules

1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Conference registrations collection
    match /conferenceRegistrations/{document} {
      // Allow anyone to create (register)
      allow create: if validateRegistration(request.resource.data);
      
      // Only allow reading/updating by authenticated admin users
      allow read, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Admin users collection
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Validation function for registration data
    function validateRegistration(data) {
      return data.keys().hasAll(['email', 'nom', 'prenom', 'situation', 'age', 'numeroTelephone']) &&
             data.email is string && data.email.matches('.*@.*\\..*') &&
             data.nom is string && data.nom.size() > 0 &&
             data.prenom is string && data.prenom.size() > 0 &&
             data.situation in ['rouge', 'bleu', 'jaune'] &&
             data.age is string &&
             data.numeroTelephone is string;
    }
  }
}
```

4. Click "Publish"

## Step 7: Create Admin User (Optional)

If you want authentication for your admin panel:

1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Enter admin email and password
4. Note the User UID
5. Go to "Firestore Database"
6. Create a new collection called `admins`
7. Create a document with ID = User UID
8. Add field: `isAdmin: true`

## Step 8: Test the Connection

1. Start your development server: `npm run dev`
2. Try registering for the conference
3. Check Firestore Database to see if data appears
4. Check browser console for any errors

## Step 9: Set Up Indexes (if needed)

If you get index errors:

1. Go to "Firestore Database" → "Indexes"
2. Click "Create index"
3. Add indexes for fields you frequently query:
   - Collection: `conferenceRegistrations`
   - Fields: `email` (Ascending), `createdAt` (Descending)

## Common Issues & Solutions

### Issue: "Permission denied" errors
**Solution**: Check your Firestore security rules and make sure they allow the operations you're trying to perform.

### Issue: "Firebase not initialized"
**Solution**: Make sure you've correctly copied the configuration from Firebase Console to `src/firebase.ts`.

### Issue: "Network error"
**Solution**: 
- Check your internet connection
- Verify Firebase project is created and billing is enabled if needed
- Check browser console for detailed error messages

### Issue: Duplicate emails not being caught
**Solution**: The duplicate check happens before Firebase save. Make sure your `checkEmailExists` function is working correctly.

## Environment Variables for Production

For production deployment, use environment variables:

```env
# .env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Monitoring & Analytics

1. Enable Analytics in Firebase Console
2. Monitor usage in "Analytics" dashboard
3. Check "Firestore" usage for read/write counts
4. Set up alerts for quota limits

## Backup Strategy

1. Go to Cloud Firestore → "Import/Export"
2. Set up automated backups
3. Export data regularly for safety

## Next Steps

1. Complete Firebase setup ✅
2. Set up your backend for email sending
3. Deploy your frontend to production
4. Configure domain and SSL certificates
5. Set up monitoring and alerts

## Support

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Guide: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/firestore/security/rules-conditions 