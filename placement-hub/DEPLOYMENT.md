# Deployment Guide

## Pre-deployment Checklist

### Files Cleaned Up ✅

- Removed dummy company data
- Removed setup scripts (setup.bat, setup.sh)
- Removed development utilities (populate_subjects.py, userprofile_backup.json)
- Updated .gitignore files for production

### Essential Files Kept

- `populate_initial_data.py` - Required for initial database setup
- `.env.example` files - Templates for environment configuration
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies

## Environment Variables for Production

### Backend (.env)

```
DEBUG=False
SECRET_KEY=your-super-secret-production-key
DATABASE_URL=your-production-database-url
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env)

```
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_ENV=production
```

## Hosting Platforms

### Recommended Hosting Options

#### Backend (Django)

1. **Railway** - Easy Django deployment
2. **Heroku** - Popular choice
3. **DigitalOcean App Platform** - Good performance
4. **Vercel** - Also supports Django

#### Frontend (React)

1. **Vercel** - Excellent for React apps
2. **Netlify** - Great for static sites
3. **GitHub Pages** - Free option
4. **Firebase Hosting** - Google's solution

### Database

- **PostgreSQL** on hosting platform
- **Supabase** - PostgreSQL with built-in features
- **PlanetScale** - MySQL alternative

## Deployment Steps

### 1. Backend Deployment

1. Set up production database
2. Update environment variables
3. Run migrations: `python manage.py migrate`
4. Create superuser: `python manage.py createsuperuser`
5. Run initial data setup: `python populate_initial_data.py`
6. Collect static files: `python manage.py collectstatic`

### 2. Frontend Deployment

1. Update API URLs in environment
2. Build production bundle: `npm run build`
3. Deploy to hosting platform

## Security Checklist

- [ ] Set DEBUG=False in production
- [ ] Use strong SECRET_KEY
- [ ] Configure CORS properly
- [ ] Set up HTTPS
- [ ] Use environment variables for secrets
- [ ] Configure proper database permissions

## Performance Optimizations

- [ ] Enable gzip compression
- [ ] Set up CDN for static files
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Monitor application performance
