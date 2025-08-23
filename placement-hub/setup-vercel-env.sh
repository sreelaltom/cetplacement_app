#!/bin/bash
# Vercel Environment Variables Setup Script
# Run this command in your project directory to set up all required environment variables

echo "Setting up Vercel environment variables for production deployment..."

# Database Configuration
echo "Setting DATABASE_URL..."
vercel env add DATABASE_URL production
# Enter: postgresql://postgres.byoqkhieazizoesflvms:Sreelaltom%40123@aws-1-us-east-2.pooler.supabase.com:6543/postgres

echo "Setting DJANGO_SECRET_KEY..."
vercel env add DJANGO_SECRET_KEY production
# Enter: placement-secret-key-production-2025

echo "Setting DEBUG..."
vercel env add DEBUG production
# Enter: False

echo "Setting SUPABASE_URL..."
vercel env add SUPABASE_URL production
# Enter: https://byoqkhieazizoesflvms.supabase.co

echo "Setting SUPABASE_KEY..."
vercel env add SUPABASE_KEY production
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5b3FraGllYXppem9lc2Zsdm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODUzOTQsImV4cCI6MjA3MTI2MTM5NH0.OU3PPtpKdK5L51qAcuq2FlA06IF88mIjqSHqRTwGHtU

# Fallback individual database variables (in case DATABASE_URL doesn't work)
echo "Setting fallback database variables..."

vercel env add SUPABASE_DB_NAME production
# Enter: postgres

vercel env add SUPABASE_DB_USER production
# Enter: postgres.byoqkhieazizoesflvms

vercel env add SUPABASE_DB_PASSWORD production
# Enter: Sreelaltom@123

vercel env add SUPABASE_DB_HOST production
# Enter: aws-1-us-east-2.pooler.supabase.com

vercel env add SUPABASE_DB_PORT production
# Enter: 6543

echo "Environment variables setup complete!"
echo "Now redeploy your application: vercel --prod"
