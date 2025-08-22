# 🚀 Railway Deployment - Step by Step Guide

## 📋 **Prerequisites**
- GitHub repository with your code
- Gmail account for OTP emails
- Existing PostgreSQL database (already created)
- 15-20 minutes time

---

## 🔧 **Step 1: Create Railway Account**

### **1.1 Go to Railway**
- Open browser: [railway.app](https://railway.app)
- Click **"Start a New Project"** button

### **1.2 Sign Up**
- Click **"Deploy from GitHub repo"**
- Click **"Connect GitHub"**
- Authorize Railway to access your GitHub
- Select your repository: `sri-chakra-diary`

---

## ⚙️ **Step 2: Deploy Backend (Skip Database Creation)**

### **2.1 Create Backend Service**
- In your Railway project dashboard
- Click **"New Service"** button
- Select **"GitHub Repo"**
- Choose your repository: `sri-chakra-diary`

### **2.2 Configure Backend**
- Set **Root Directory** to: `backend`
- Set **Build Command** to: `npm install`
- Set **Start Command** to: `npm start`
- Click **"Deploy"**

### **2.3 Wait for Deployment**
- Railway will install dependencies
- Wait 2-3 minutes for deployment to complete
- You'll see a green checkmark when ready

---

## 🔐 **Step 3: Set Environment Variables**

### **3.1 Go to Backend Service**
- Click on your **backend service**
- Go to **"Variables"** tab

### **3.2 Add These Variables**
Click **"New Variable"** and add each one:

```env
DATABASE_URL=postgresql://postgres:gFa42eB1dAdEga6dBfgFEG4age331d6E@mainline.proxy.rlwy.net:46839/postgres
JWT_SECRET=sri_chakra_diary_secret_key_2024
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### **3.3 Important Notes:**
- **DATABASE_URL**: Using your existing Railway database
- **EMAIL_USER**: Your Gmail address
- **EMAIL_PASS**: Gmail app password (not regular password)
- **FRONTEND_URL**: You'll update this after deploying frontend

---

## 🗃️ **Step 4: Run Database Setup**

### **4.1 Trigger New Deployment**
- In your backend service
- Go to **"Deployments"** tab
- Click **"Deploy"** button
- This will run the database setup script

### **4.2 Verify Setup**
- Wait for deployment to complete
- Check the logs for success messages:
  - ✅ "Deployment setup completed successfully!"
  - ✅ "All required columns and tables are ready"

---

## 🔗 **Step 5: Get Your Backend URL**

### **5.1 Copy Backend URL**
- In your backend service
- Go to **"Settings"** tab
- Copy the **"Domain"** URL
- It will look like: `https://your-app-name-production.up.railway.app`

### **5.2 Update Frontend URL Variable**
- Go back to **"Variables"** tab
- Update `FRONTEND_URL` with your Vercel frontend URL
- (You'll get this after deploying frontend)

---

## ✅ **Step 6: Test Backend**

### **6.1 Health Check**
- Open your backend URL in browser
- Add `/health` at the end
- Example: `https://your-app-name-production.up.railway.app/health`
- Should show: `{"status":"OK","database":"Connected"}`

### **6.2 Test API**
- Try: `https://your-app-name-production.up.railway.app/api/employees`
- Should return JSON (even if empty array)

---

## 🎨 **Step 7: Deploy Frontend (Vercel)**

### **7.1 Go to Vercel**
- Open: [vercel.com](https://vercel.com)
- Sign up with GitHub
- Click **"New Project"**

### **7.2 Import Repository**
- Select your `sri-chakra-diary` repository
- Set **Root Directory** to: `frontend`
- Set **Build Command** to: `npm run build`
- Set **Output Directory** to: `dist`

### **7.3 Add Environment Variable**
- In **Environment Variables** section
- Add: `VITE_API_URL` = `your_railway_backend_url`
- Click **"Deploy"**

---

## 🔄 **Step 8: Connect Frontend & Backend**

### **8.1 Update Backend CORS**
- Go back to Railway backend service
- Update `FRONTEND_URL` variable with your Vercel URL
- Trigger new deployment

### **8.2 Test Complete App**
- Visit your Vercel frontend URL
- Try logging in with: `9059549852`
- Verify OTP is sent
- Check if login works

---

## 🚨 **Troubleshooting**

### **If Backend Won't Start:**
1. Check **"Variables"** tab - all required variables set?
2. Check **"Deployments"** tab - any error messages?
3. Verify `DATABASE_URL` is correct

### **If Database Connection Fails:**
1. Run database setup script again
2. Check if your existing database is accessible
3. Verify `DATABASE_URL` format

### **If Frontend Can't Connect:**
1. Check `VITE_API_URL` in Vercel
2. Verify backend URL is accessible
3. Check CORS settings in backend

---

## 📞 **Support**

### **Railway Support:**
- Documentation: [docs.railway.app](https://docs.railway.app)
- Discord: [discord.gg/railway](https://discord.gg/railway)

### **Common Issues:**
- **Port binding error**: Railway sets PORT automatically
- **Database timeout**: Check DATABASE_URL
- **Build failures**: Check package.json dependencies

---

## 🎯 **Success Checklist**

- [ ] Railway account created
- [ ] Backend service deployed
- [ ] Environment variables set (using existing database)
- [ ] Database setup script run
- [ ] Backend URL copied
- [ ] Frontend deployed on Vercel
- [ ] Frontend connected to backend
- [ ] Login test successful
- [ ] OTP email received

**🎉 Your app is now live!** 🚀
