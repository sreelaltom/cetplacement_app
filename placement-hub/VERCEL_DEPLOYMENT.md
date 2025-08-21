# 🚀 Complete Vercel Deployment Guide for Placement Hub

## Overview

This guide will help you deploy both your Django backend and React frontend on Vercel.

## 📋 Prerequisites

1. GitHub account
2. Vercel account (sign up at vercel.com)
3. Supabase account for database (or any PostgreSQL database)

## 🗂️ Repository Structure

```
placement-hub/
├── backend/          # Django API
│   ├── vercel.json   # Vercel config for backend
│   ├── build_files.sh
│   └── requirements.txt
├── frontend/         # React app
│   ├── package.json
│   └── vite.config.js
└── DEPLOYMENT.md
```

## 🎯 Step-by-Step Deployment

### 1. Prepare Your Repository

#### Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy Backend (Django) on Vercel

#### A. Create Vercel Project for Backend

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `backend`
5. **Framework Preset**: Other
6. Click "Deploy"

#### B. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
# Django Settings
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=False
DATABASE_URL=your-supabase-database-url

# Supabase (if using)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_DB_PASSWORD=your-db-password

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### C. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password
6. Use this as `DATABASE_URL` in Vercel

### 3. Deploy Frontend (React) on Vercel

#### A. Create Vercel Project for Frontend

1. Click "New Project" in Vercel
2. Import the same GitHub repository
3. Set **Root Directory** to `frontend`
4. **Framework Preset**: Vite
5. Click "Deploy"

#### B. Configure Frontend Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api
VITE_APP_ENV=production
```

### 4. Update Frontend API Configuration

Update your frontend API service to use the production URL:

```javascript
// In frontend/src/services/api.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
```

### 5. Initialize Database

#### A. Run Migrations

After backend deployment, run migrations via Vercel Function:

1. Go to your backend Vercel project
2. Navigate to Functions tab
3. Trigger the migration endpoint or use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run migration command
vercel exec -- python manage.py migrate
```

#### B. Create Initial Data

```bash
vercel exec -- python populate_initial_data.py
```

#### C. Create Superuser

```bash
vercel exec -- python manage.py createsuperuser
```

## 🔧 Configuration Files

### Backend vercel.json (already created)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "hub/wsgi.py",
      "use": "@vercel/python",
      "config": { "maxLambdaSize": "15mb", "runtime": "python3.9" }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "hub/wsgi.py"
    }
  ]
}
```

### Frontend vercel.json (create this in frontend/)

```json
{
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔒 Security Checklist

- [ ] Set strong `DJANGO_SECRET_KEY`
- [ ] Set `DEBUG=False` in production
- [ ] Configure proper CORS origins
- [ ] Use HTTPS URLs for API calls
- [ ] Secure database credentials
- [ ] Set up proper allowed hosts

## 🐛 Troubleshooting

### Common Issues:

#### 1. CORS Errors

- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
- Check `FRONTEND_URL` environment variable

#### 2. Database Connection

- Verify `DATABASE_URL` format
- Check Supabase connection settings
- Ensure database is accessible from Vercel

#### 3. Static Files

- Run `python manage.py collectstatic`
- Check static file configuration

#### 4. Build Failures

- Check `requirements.txt` has all dependencies
- Verify Python version compatibility
- Check build logs in Vercel dashboard

### Useful Commands:

```bash
# View logs
vercel logs

# Deploy specific commit
vercel --prod

# Environment variables
vercel env ls
vercel env add VARIABLE_NAME
```

## 🚀 Post-Deployment

1. **Test all endpoints**: Visit your API at `https://your-backend.vercel.app/api/`
2. **Test frontend**: Check all features work on `https://your-frontend.vercel.app`
3. **Admin panel**: Access at `https://your-backend.vercel.app/admin/`
4. **Monitor**: Set up monitoring for errors and performance

## 📱 Custom Domains (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS settings as instructed
4. Update environment variables with new URLs

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- `main` branch → Production
- Other branches → Preview deployments

That's it! Your Placement Hub should now be live on Vercel! 🎉
