# Quick Start Guide - Survey Integration

## 🚀 Setup in 3 Steps

### Step 1: Create `.env` File

```bash
# Copy the example file
copy .env.example .env
```

Then edit `.env` and set:
```env
VITE_API_URL=https://api.whataboutyou.net/api
```

### Step 2: Install & Run

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:6500`

### Step 3: Test the Survey

1. Navigate to `http://localhost:6500/#/sondage`
2. Fill out the survey form
3. Submit and verify success message

## ✅ What Changed

**Before:** Surveys saved directly to Firebase
**Now:** Surveys sent to backend API at `https://api.whataboutyou.net/api`

## 🎁 New Benefits

✅ **Rate Limiting:** 3 submissions per hour per IP
✅ **Duplicate Prevention:** 1 submission per email per day
✅ **Better Validation:** Server-side validation with French error messages
✅ **Statistics API:** Real-time statistics in admin panel

## 🔧 Files Modified

- ✨ **NEW:** `src/services/surveyService.ts` - API integration
- ✅ **UPDATED:** `src/pages/SondagePage.tsx` - Uses API instead of Firebase
- ✅ **UPDATED:** `src/pages/admin/components/SurveyResponses.tsx` - Fetches from API
- ✅ **UPDATED:** `.env.example` - Added API URL configuration

## 📚 Full Documentation

See `SURVEYS_FRONTEND_INTEGRATION.md` for complete documentation.

## 🐛 Troubleshooting

**Issue: Network Error**
- Check backend is running: `pm2 status`
- Verify API URL in `.env` is correct
- Test API: `curl https://api.whataboutyou.net/api/surveys/statistics`

**Issue: Rate Limit Error**
- Wait 1 hour before retrying
- Or increase limit in backend configuration

**Issue: Admin Panel Empty**
- Check browser console for errors
- Verify backend API is accessible
- Admin authentication needs to be implemented (TODO)

## 🚦 Next Steps

1. ⚠️ **Add admin authentication guards** on backend
2. 📊 Add CSV export functionality
3. 📧 Add email notifications for new surveys
4. 🔄 Optional: Add real-time updates with WebSockets

---

**Need Help?** Check the full documentation in `SURVEYS_FRONTEND_INTEGRATION.md`
