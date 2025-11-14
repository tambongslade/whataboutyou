# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application for "What About You", an event management platform featuring conference registrations, Miss & Master competitions, tombola/lottery system, boutique, and team showcases. The project uses TailwindCSS for styling and Firebase for backend services.

## Development Commands

```bash
# Start development server (runs on port 6500)
npm run dev

# Build for production
npm run build

# Build with optimized images
npm run build:optimized

# Lint code
npm run lint

# Preview production build
npm run preview

# Optimize images
npm run optimize-images
```

## Architecture & Key Directories

### Frontend Structure
- **`src/pages/`** - Main application pages organized by feature:
  - `admin/` - Admin dashboard with authentication and registration management
  - `events/` - Event listing and details
  - `miss-and-master/` - Competition platform with candidate profiles and voting
  - `tombola/` - Lottery/raffle system
- **`src/components/`** - Reusable UI components (Navbar, Footer, modals, etc.)
- **`src/services/`** - Business logic services for email and registration handling

### Key Features
- **Conference Registration System** - Modal-based registration with Firebase integration
- **Miss & Master Competition** - Candidate profiles, voting system, photo galleries
- **Admin Panel** - Registration management, statistics dashboard
- **Image Optimization** - WebP/AVIF support with custom optimization scripts
- **Responsive Design** - TailwindCSS with mobile-first approach

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS v4 with Vite plugin
- **Routing**: React Router DOM v7
- **Backend**: Firebase (Firestore, Authentication)
- **Image Processing**: Sharp, Squoosh, imagemin for optimization
- **Build Tool**: Vite with custom chunk splitting and Terser optimization

## Firebase Integration

The project requires Firebase setup for:
- Firestore database for storing conference registrations
- Authentication for admin access
- Refer to `FIREBASE_SETUP.md` for complete setup instructions
- Security rules are configured to allow public registration creation and admin-only reads

## Backend Requirements

Currently frontend-only. For production deployment with email functionality:
- See `BACKEND_REQUIREMENTS.md` for email service setup
- Consider Node.js/Express or NestJS backend
- Email providers: Gmail SMTP, SendGrid, or Mailgun
- Deploy to Vercel, Railway, or Google Cloud Functions

## Image Management

- Images are stored in `public/` directory organized by feature
- Candidate photos for Miss competition are in `public/miss2025/`
- Run `npm run optimize-images` before production builds
- Supports WebP and AVIF formats for optimized loading

## Development Notes

- Dev server proxy configured for `/api` to `localhost:5000` for backend integration
- Console logs are stripped in production builds
- Uses manual chunk splitting for vendor libraries (React, React DOM, React Router)
- TailwindCSS configured with Vite plugin for optimal performance
- TypeScript strict mode enabled with separate configs for app and build tools

## Component Patterns

- Components use TypeScript interfaces for props
- Modal components handle their own state management
- Image components use lazy loading and optimization
- Admin components require authentication state
- Responsive design patterns follow mobile-first approach

## Testing & Quality

- ESLint configured with React hooks and refresh plugins
- TypeScript compiler checks enabled
- No test framework currently configured
- Code formatting follows standard React/TypeScript conventions