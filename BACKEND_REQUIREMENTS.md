# Backend Requirements for Conference Registration System

## Overview
You need a backend to handle:
1. **Email sending** (confirmation emails)
2. **Firebase security rules**
3. **API endpoints for email functionality**

## Required Backend Setup

### 1. Technology Stack Options

**Option A: Node.js + Express**
```bash
npm init -y
npm install express nodemailer firebase-admin cors helmet dotenv
```

**Option B: Python + Flask**
```bash
pip install flask flask-mail firebase-admin python-dotenv flask-cors
```

**Option C: NestJS (Recommended)**
```bash
npm i @nestjs/cli
nest new conference-backend
npm install @nestjs/mailer nodemailer firebase-admin
```

### 2. Environment Variables (.env)

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Email Service (Choose one)
# Gmail SMTP
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# SendGrid (Alternative)
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@whataboutyou.com

# Mailgun (Alternative)
MAILGUN_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-domain.mailgun.org
```

### 3. Required API Endpoints

#### POST `/api/send-confirmation-email`
- **Purpose**: Send confirmation email to registered user
- **Input**: Registration data + email template
- **Security**: Validate Firebase token, rate limiting
- **Response**: Success/error status

#### GET `/api/registrations` (Admin only)
- **Purpose**: Get all registrations for admin panel
- **Security**: Admin authentication required
- **Response**: List of registrations

### 4. Email Service Implementation Examples

#### Node.js with Nodemailer (Gmail):
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
  }
});

const sendConfirmationEmail = async (emailData) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: emailData.recipientEmail,
    subject: `Confirmation d'inscription - ${emailData.registrationNumber}`,
    html: getEmailTemplate(emailData)
  };

  return await transporter.sendMail(mailOptions);
};
```

#### Alternative: SendGrid
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmail = async (emailData) => {
  const msg = {
    to: emailData.recipientEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Confirmation d'inscription - ${emailData.registrationNumber}`,
    html: getEmailTemplate(emailData)
  };

  return await sgMail.send(msg);
};
```

### 5. Firebase Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reads for admin users only
    match /conferenceRegistrations/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
      
      // Allow create for authenticated users (registration)
      allow create: if request.auth != null &&
        validateRegistrationData(resource.data);
    }
    
    function validateRegistrationData(data) {
      return data.keys().hasAll(['email', 'nom', 'prenom', 'situation']) &&
             data.email is string &&
             data.nom is string &&
             data.prenom is string;
    }
  }
}
```

### 6. Firebase Admin Setup

```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
```

### 7. Rate Limiting & Security

```javascript
const rateLimit = require('express-rate-limit');

// Limit email sending
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many email requests from this IP'
});

app.use('/api/send-confirmation-email', emailLimiter);
```

## Deployment Options

### 1. **Vercel** (Recommended for Node.js)
- Easy deployment
- Automatic HTTPS
- Environment variables support
- Free tier available

### 2. **Railway**
- Good for Node.js/Python
- Database hosting
- Environment variables
- Affordable pricing

### 3. **Heroku**
- Supports multiple languages
- Add-ons for databases
- Easy scaling

### 4. **Google Cloud Functions** (Serverless)
- Pay per execution
- Auto-scaling
- Integrates well with Firebase

## Setup Steps

1. **Create Firebase Project**
   - Go to Firebase Console
   - Create new project
   - Enable Firestore
   - Generate Admin SDK key

2. **Set up Email Service**
   - Choose provider (Gmail/SendGrid/Mailgun)
   - Get API credentials
   - Configure SMTP/API settings

3. **Deploy Backend**
   - Choose hosting platform
   - Set environment variables
   - Deploy your backend code

4. **Update Frontend**
   - Replace API endpoint URLs
   - Add authentication if needed

## Example Complete Backend Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── emailController.js
│   │   └── registrationController.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── firebaseService.js
│   │   └── validationService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimit.js
│   └── routes/
│       ├── email.js
│       └── registration.js
├── .env
├── package.json
└── server.js
```

## Next Steps

1. Choose your backend technology
2. Set up Firebase Admin SDK
3. Configure email service
4. Implement API endpoints
5. Deploy to hosting platform
6. Update frontend to use real API endpoints

## Cost Estimates

- **Firebase**: Free tier (up to 50K reads, 20K writes per day)
- **Gmail SMTP**: Free (up to 500 emails/day)
- **SendGrid**: Free tier (100 emails/day), $15/month for 40K emails
- **Hosting**: Vercel free tier, Railway $5/month, Heroku $7/month 