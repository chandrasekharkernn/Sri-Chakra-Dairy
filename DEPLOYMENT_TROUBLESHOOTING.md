# Sri Chakra Diary - Deployment Troubleshooting Guide

## Current Issue: Unable to Login After Deployment

### Environment Setup

#### Frontend (Vercel)
Set these environment variables in your frontend Vercel project:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

#### Backend (Vercel)  
Set these environment variables in your backend Vercel project:

```
DATABASE_URL=postgresql://postgres:S3@@@1303@db.yrakjnonabrqyicyvdam.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-sri-chakra-diary-2024
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
EMAIL_USER=donotreplythisisotp@gmail.com
EMAIL_PASS=jwkuexaybpynqubr
SUPER_ADMIN_IDS=1,2,3
LOG_LEVEL=info
```

### Common Deployment Issues & Solutions

#### 1. CORS Errors
**Problem:** Frontend can't connect to backend due to cross-origin restrictions
**Solution:** 
- Updated CORS configuration in `backend/server.js`
- Added dynamic origin checking
- Included proper headers and methods

#### 2. API URL Mismatch
**Problem:** Frontend using wrong backend URL
**Solution:**
- Updated `frontend/src/config/axios.js` to use environment variable
- Updated `frontend/src/lib/api.js` similarly
- Set `VITE_API_URL` in Vercel frontend environment

#### 3. Database Connection Issues
**Problem:** Backend can't connect to Supabase
**Solution:**
- Ensure `DATABASE_URL` is set in backend Vercel environment
- Check Supabase connection string format
- Verify SSL settings for production

#### 4. Authentication Flow Issues
**Problem:** OTP generation or verification failing
**Solution:**
- Check if users exist in database
- Verify JWT_SECRET is set
- Ensure email configuration is working

### Testing Steps

1. **Backend Health Check:**
   ```
   https://your-backend-url.vercel.app/health
   ```

2. **CORS Test:**
   - Open browser developer tools
   - Check Network tab for CORS errors
   - Verify preflight OPTIONS requests succeed

3. **Database Connection:**
   - Check backend logs in Vercel dashboard
   - Look for "Connected to PostgreSQL database" message

4. **Authentication Test:**
   - Try generating OTP
   - Check backend logs for OTP generation
   - Verify user exists in database

### Debug Information

#### Frontend Console Logs
```javascript
console.log('🔧 API URL:', import.meta.env.VITE_API_URL)
console.log('🔧 Axios baseURL:', axios.defaults.baseURL)
```

#### Backend Console Logs
```javascript
console.log('🔧 CORS allowed origins:', allowedOrigins)
console.log('🔧 Using DATABASE_URL:', databaseUrl)
```

### Quick Fixes

1. **Update Backend URL:** Replace `https://sri-chakra-dairy-backend-jwmt38r86.vercel.app` with your actual backend URL
2. **Set Environment Variables:** Ensure all required env vars are set in Vercel
3. **Redeploy:** After setting env vars, redeploy both frontend and backend
4. **Check Database:** Verify users table exists and has test data

### Verification Checklist

- [ ] Backend health endpoint responds
- [ ] CORS headers present in network requests
- [ ] Database connection established
- [ ] Environment variables set in Vercel
- [ ] Frontend uses correct backend URL
- [ ] JWT_SECRET is secure and consistent
- [ ] Email configuration working (optional)

### Next Steps

1. Set all environment variables in Vercel dashboards
2. Update backend URL in frontend environment variable
3. Redeploy both applications
4. Test login flow with existing user mobile number
5. Check browser developer tools for any remaining errors

---
**Note:** Make sure your mobile number exists in the `users` table in your Supabase database before testing login.
