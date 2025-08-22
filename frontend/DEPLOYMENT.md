# Frontend Deployment Guide

## Issues Fixed

1. ✅ Fixed favicon path (was pointing to non-existent `/images.jpeg`, now points to `/sri chakra logo.png`)
2. ✅ Added proper deployment configurations for multiple platforms
3. ✅ Updated Vite config for production builds
4. ✅ Created deployment scripts and workflows

## Deployment Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages

The GitHub Actions workflow will automatically deploy when you push to the main branch.

### 4. Manual Deployment

1. Build the project:
   ```bash
   cd frontend
   npm run build
   ```

2. Upload the contents of the `dist` folder to your hosting provider

## Environment Variables

Make sure to set the correct backend URL in your deployment environment:

```bash
VITE_API_URL=https://your-backend-url.com
```

## Common Issues and Solutions

### 1. Build Fails
- Ensure all dependencies are installed: `npm install`
- Check for syntax errors in your code
- Verify all imports are correct

### 2. 404 Errors on Refresh
- This is handled by the deployment configurations (vercel.json, netlify.toml)
- All routes redirect to index.html for SPA routing

### 3. API Connection Issues
- Update the backend URL in `src/config/axios.js` for production
- Ensure CORS is properly configured on your backend

### 4. Assets Not Loading
- Check that the base URL is correctly set in vite.config.js
- Verify all asset paths are relative

## Testing Deployment

1. Build locally: `npm run build`
2. Test locally: `npm run preview`
3. Deploy to staging environment first
4. Test all functionality before going to production

## Backend Integration

Remember to update the backend URL in your deployed frontend to point to your production backend server, not localhost.
