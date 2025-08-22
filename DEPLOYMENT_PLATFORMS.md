# 🚀 Sri Chakra Diary - Platform-Specific Deployment Guide

## 🎯 **Recommended Stack: Railway + Vercel**

### **Backend: Railway**
### **Frontend: Vercel**
### **Database: Railway PostgreSQL**

---

## 🔧 **Backend Deployment (Railway)**

### **Step 1: Setup Railway Account**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### **Step 2: Add PostgreSQL Database**
1. Click "New Service"
2. Select "Database" → "PostgreSQL"
3. Wait for database to be created
4. Copy the `DATABASE_URL` from variables

### **Step 3: Deploy Backend**
1. Click "New Service" → "GitHub Repo"
2. Select your repository
3. Set root directory to `backend`
4. Set build command: `npm install`
5. Set start command: `npm start`

### **Step 4: Environment Variables**
Add these in Railway dashboard:
```env
DATABASE_URL=your_railway_postgres_url
JWT_SECRET=sri_chakra_diary_secret_key_2024
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### **Step 5: Run Database Setup**
1. Go to your backend service
2. Click "Deployments" tab
3. Click "Deploy" to trigger new deployment
4. The deployment setup script will run automatically

---

## 🎨 **Frontend Deployment (Vercel)**

### **Step 1: Setup Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### **Step 2: Configure Project**
1. Set root directory to `frontend`
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set install command: `npm install`

### **Step 3: Environment Variables**
Add in Vercel dashboard:
```env
VITE_API_URL=https://your-backend-domain.railway.app
```

### **Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Copy the deployment URL

---

## 🔄 **Alternative Platforms**

### **Backend Alternatives:**

#### **Render**
- **URL:** [render.com](https://render.com)
- **Pros:** Free tier, PostgreSQL, easy setup
- **Cons:** Slower cold starts

#### **Heroku**
- **URL:** [heroku.com](https://heroku.com)
- **Pros:** Reliable, good documentation
- **Cons:** No free tier anymore

#### **DigitalOcean App Platform**
- **URL:** [digitalocean.com](https://digitalocean.com)
- **Pros:** Good performance, reasonable pricing
- **Cons:** More complex setup

### **Frontend Alternatives:**

#### **Netlify**
- **URL:** [netlify.com](https://netlify.com)
- **Pros:** Free tier, easy deployment
- **Cons:** Slightly slower than Vercel

#### **GitHub Pages**
- **URL:** [pages.github.com](https://pages.github.com)
- **Pros:** Free, integrated with GitHub
- **Cons:** Limited features

---

## 🚨 **Pre-Deployment Checklist**

### **Backend Checklist:**
- [ ] Database setup script ready (`npm run deploy-setup`)
- [ ] Environment variables configured
- [ ] CORS settings updated for frontend domain
- [ ] All dependencies in package.json
- [ ] Start script configured (`npm start`)

### **Frontend Checklist:**
- [ ] API URL environment variable set
- [ ] Build script working (`npm run build`)
- [ ] All dependencies in package.json
- [ ] No hardcoded localhost URLs

### **Database Checklist:**
- [ ] PostgreSQL database created
- [ ] Connection string copied
- [ ] Database setup script run
- [ ] All tables exist
- [ ] Super admin user created

---

## 🔧 **Post-Deployment Verification**

### **1. Health Check**
```bash
curl https://your-backend-domain.railway.app/health
```

### **2. Test Login**
- Visit frontend URL
- Login with employee number: `9059549852`
- Verify OTP is sent
- Check if login works

### **3. Test Data Entry**
- Create a new employee
- Add some opening stock data
- Generate a daily report
- Verify PDF download works

### **4. Check Database**
- Connect to Railway PostgreSQL
- Verify data is being saved
- Check all tables exist

---

## 🆘 **Troubleshooting**

### **Common Issues:**

#### **Backend Issues:**
- **Port binding error:** Ensure `PORT` environment variable is set
- **Database connection failed:** Check `DATABASE_URL`
- **CORS errors:** Verify `FRONTEND_URL` is correct

#### **Frontend Issues:**
- **API calls failing:** Check `VITE_API_URL`
- **Build errors:** Verify all dependencies installed
- **Routing issues:** Check Vite configuration

#### **Database Issues:**
- **Missing columns:** Run `npm run deploy-setup`
- **Connection timeout:** Check database URL
- **Permission errors:** Verify database credentials

---

## 💰 **Cost Estimation**

### **Railway (Backend + Database):**
- **Free tier:** $0/month (limited usage)
- **Paid tier:** $5-20/month (depending on usage)

### **Vercel (Frontend):**
- **Free tier:** $0/month (unlimited)
- **Paid tier:** $20/month (for advanced features)

### **Total Estimated Cost:**
- **Free tier:** $0/month
- **Paid tier:** $5-40/month

---

## 🎯 **Final Recommendation**

**Use Railway + Vercel combination** because:
1. ✅ Both have excellent free tiers
2. ✅ Automatic deployments from GitHub
3. ✅ Built-in PostgreSQL database
4. ✅ Great performance and reliability
5. ✅ Easy environment variable management
6. ✅ Good documentation and support

**This combination will give you the smoothest deployment experience with minimal issues!** 🚀
