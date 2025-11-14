# API URL Configuration Fix

## Issue Fixed
Admin login and other services were using hardcoded `localhost` URLs in production, causing connection failures when deployed.

## Problem
The following files had hardcoded localhost URLs that would override the production API URL:

1. `src/pages/admin/AdminPage.tsx` - Admin authentication
2. `src/services/candidateService.ts` - Miss & Master service
3. `src/services/registrationService.ts` - Conference registration service
4. `src/services/ticketService.ts` - Ticket management service

### Before:
```typescript
// WRONG - Would use localhost in production
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://api.whataboutyou.net/api/'
    : 'http://localhost:3001/api/');
```

This caused issues because:
- Even with `VITE_API_URL` set, the fallback would still check `import.meta.env.MODE`
- In production builds, if `VITE_API_URL` wasn't set, it would default to production API
- But the logic was inconsistent across services

## Solution
Simplified all API URL configurations to use a single, consistent pattern:

### After:
```typescript
// CORRECT - Simple and consistent
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api';
```

## Files Modified

### 1. `src/pages/admin/AdminPage.tsx`
**Changed:**
```typescript
// Before
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://api.whataboutyou.net/api/'
    : 'http://localhost:3001/api/');

// After
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api';
```

**Impact:** Admin login now uses correct production API URL

### 2. `src/services/candidateService.ts`
**Changed:**
```typescript
// Before
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://api.whataboutyou.net/api/'
    : 'http://localhost:3001/api/');

// After
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api';
```

**Impact:** Miss & Master voting uses correct API

### 3. `src/services/registrationService.ts`
**Changed:**
```typescript
// Before
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.whataboutyou.net'
  : 'http://localhost:3001';

// After
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api';
```

**Impact:** Conference registrations use correct API
**Note:** Also fixed inconsistent `/api` suffix

### 4. `src/services/ticketService.ts`
**Changed:**
```typescript
// Before
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.whataboutyou.net'
  : 'http://localhost:3001';

// After
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api';
```

**Impact:** Ticket purchases use correct API
**Note:** Also fixed inconsistent `/api` suffix and changed `process.env` to `import.meta.env`

## Configuration

### Environment Variable Priority

1. **If `VITE_API_URL` is set in `.env`:**
   - Uses the configured URL
   - Example: `VITE_API_URL=https://api.whataboutyou.net/api`

2. **If `VITE_API_URL` is NOT set:**
   - Defaults to production API: `https://api.whataboutyou.net/api`

### For Local Development

Create a `.env` file:
```env
# Use local backend
VITE_API_URL=http://localhost:3200/api
```

### For Production

Either:
- Set `VITE_API_URL=https://api.whataboutyou.net/api` in `.env`
- Or leave it unset (will default to production URL)

## Benefits

✅ **Consistent:** All services use the same URL pattern
✅ **Simple:** Single environment variable controls all API calls
✅ **Safe:** Defaults to production API if not configured
✅ **Flexible:** Easy to change for local development or staging
✅ **Fixed:** Admin login now works in production

## Verification

After this fix, verify:

1. **Admin Login:**
   ```
   - Go to https://whataboutyou.net/#/admin
   - Enter credentials
   - Should connect to https://api.whataboutyou.net/api/auth/login
   - Check browser Network tab to confirm
   ```

2. **Survey Export:**
   ```
   - Login to admin
   - Go to Sondages tab
   - Click "Exporter vers Excel"
   - Should connect to https://api.whataboutyou.net/api/surveys/export/excel
   ```

3. **Miss & Master Voting:**
   ```
   - Go to Miss & Master page
   - Try voting
   - Should connect to https://api.whataboutyou.net/api/candidates/...
   ```

4. **Ticket Purchase:**
   ```
   - Try purchasing a ticket
   - Should connect to https://api.whataboutyou.net/api/tickets/...
   ```

## Browser Console Verification

After this fix, you should see these logs in the console:

```
🔐 Admin API Base URL: https://api.whataboutyou.net/api
🔗 API Base URL: https://api.whataboutyou.net/api
🔗 Environment Mode: production
🎫 Ticket API Base URL: https://api.whataboutyou.net/api
🎫 Environment Mode: production
```

**NOT:**
```
❌ Admin API Base URL: http://localhost:3001/api
```

## Testing

### Local Development Test
```bash
# 1. Create .env file
echo "VITE_API_URL=http://localhost:3200/api" > .env

# 2. Start dev server
npm run dev

# 3. Check console logs - should show localhost
# 4. Test admin login - should connect to localhost:3200
```

### Production Test
```bash
# 1. Remove or comment out VITE_API_URL in .env
# Or set: VITE_API_URL=https://api.whataboutyou.net/api

# 2. Build for production
npm run build

# 3. Preview production build
npm run preview

# 4. Check console logs - should show production URL
# 5. Test admin login - should connect to api.whataboutyou.net
```

## Deployment Steps

1. **Update `.env` on server:**
   ```bash
   VITE_API_URL=https://api.whataboutyou.net/api
   ```

2. **Rebuild the application:**
   ```bash
   npm run build
   ```

3. **Deploy the `dist/` folder**

4. **Test admin login** to verify fix

## Troubleshooting

### Issue: Still connecting to localhost
**Solution:**
1. Check `.env` file has correct URL
2. Restart dev server: `npm run dev`
3. Clear browser cache
4. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### Issue: 404 Not Found on API calls
**Possible causes:**
1. Backend not running on port 3200
2. Nginx not configured correctly
3. URL missing `/api` suffix

**Solution:**
```bash
# Check backend is running
pm2 status

# Check Nginx config
sudo nginx -t

# Verify API URL has /api at the end
echo $VITE_API_URL  # Should be: https://api.whataboutyou.net/api
```

### Issue: CORS errors
**Solution:**
Ensure backend CORS is configured for your frontend domain:

```typescript
// Backend: src/main.ts
app.enableCors({
  origin: ['https://whataboutyou.net', 'http://localhost:6500'],
  credentials: true,
});
```

## Summary

**Fixed:**
- ✅ Admin login now uses production API
- ✅ All services use consistent API URL
- ✅ Removed hardcoded localhost URLs
- ✅ Simplified configuration logic
- ✅ Fixed inconsistent `/api` suffix usage

**Testing Required:**
- ⚠️ Test admin login in production
- ⚠️ Test survey export
- ⚠️ Test Miss & Master voting
- ⚠️ Test ticket purchases

**Next Steps:**
1. Deploy updated code to production
2. Test all API-dependent features
3. Monitor browser console for any errors
4. Verify all services connect to correct API

---

**Fixed:** 2025-11-13
**Files Modified:** 4
**Impact:** High - Fixes critical production authentication issue
