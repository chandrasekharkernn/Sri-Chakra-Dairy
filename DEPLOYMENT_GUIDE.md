# 🚀 Sri Chakra Diary - Deployment Guide

## Pre-Deployment Checklist

### 1. Database Setup
Before deploying, ensure your database is properly configured:

```bash
# Run the deployment setup script
cd backend
npm run deploy-setup
```

This script will:
- ✅ Add all missing columns to users table
- ✅ Add missing columns to opening_stock_data table
- ✅ Update super admin user
- ✅ Verify all required tables exist

### 2. Environment Variables
Ensure these environment variables are set in your deployment platform:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Configuration (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. Database Tables Required
The following tables must exist in your database:
- `users`
- `sales_data`
- `other_dairy_sales_data`
- `products_data`
- `silo_closing_balance_data`
- `products_closing_stock_data`
- `waiting_tanker_data`
- `third_party_procurement_data`
- `opening_stock_data`

### 4. Required Columns
The `users` table must have these columns:
- `id` (primary key)
- `employee_number` (required)
- `username`
- `email`
- `password_hash`
- `role` (default: 'employee')
- `is_active` (default: true)
- `mobile_number`
- `department` (default: 'Not Assigned')
- `created_at`
- `updated_at`

## Deployment Steps

### Backend Deployment (Vercel/Railway/Render)

1. **Connect your repository**
2. **Set environment variables**
3. **Set build command:** `npm install`
4. **Set start command:** `npm start`
5. **Run deployment setup:** `npm run deploy-setup`

### Frontend Deployment (Vercel/Netlify)

1. **Connect your repository**
2. **Set build command:** `npm run build`
3. **Set environment variables:**
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```

## Post-Deployment Verification

### 1. Health Check
Visit: `https://your-backend-domain.com/health`

Should return:
```json
{
  "status": "OK",
  "database": "Connected"
}
```

### 2. Test Login
- Try logging in with employee number: `9059549852`
- Verify OTP is sent
- Check if login redirects properly

### 3. Test Employee Creation
- Create a new employee
- Verify no 500 errors
- Check if employee appears in list

### 4. Test Daily Reports
- Generate a daily report
- Verify all data sections load
- Check PDF preview and download

## Common Issues & Solutions

### Issue: "column does not exist" errors
**Solution:** Run `npm run deploy-setup` before starting the application

### Issue: CORS errors
**Solution:** Ensure `FRONTEND_URL` environment variable is set correctly

### Issue: Database connection failed
**Solution:** Check `DATABASE_URL` environment variable

### Issue: OTP emails not sending
**Solution:** Verify email credentials in environment variables

## Emergency Rollback

If deployment fails:

1. **Revert to previous version**
2. **Run deployment setup:** `npm run deploy-setup`
3. **Check environment variables**
4. **Verify database connection**

## Support

If you encounter issues:
1. Check the deployment logs
2. Verify all environment variables
3. Run the deployment setup script
4. Check database connectivity

---

**Note:** Always run `npm run deploy-setup` before deploying to ensure all database columns exist!
