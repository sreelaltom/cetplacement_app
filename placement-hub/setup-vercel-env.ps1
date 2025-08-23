# Vercel Environment Variables Setup Script for Windows PowerShell
# Run this in your project directory to set up all required environment variables

Write-Host "Setting up Vercel environment variables for production deployment..." -ForegroundColor Green

# Database Configuration
Write-Host "`nSetting DATABASE_URL..." -ForegroundColor Yellow
Write-Host "Run: vercel env add DATABASE_URL production" -ForegroundColor Cyan
Write-Host "Enter: postgresql://postgres.byoqkhieazizoesflvms:Sreelaltom%40123@aws-1-us-east-2.pooler.supabase.com:6543/postgres" -ForegroundColor Gray

Write-Host "`nSetting DJANGO_SECRET_KEY..." -ForegroundColor Yellow
Write-Host "Run: vercel env add DJANGO_SECRET_KEY production" -ForegroundColor Cyan
Write-Host "Enter: placement-secret-key-production-2025" -ForegroundColor Gray

Write-Host "`nSetting DEBUG..." -ForegroundColor Yellow
Write-Host "Run: vercel env add DEBUG production" -ForegroundColor Cyan
Write-Host "Enter: False" -ForegroundColor Gray

Write-Host "`nSetting SUPABASE_URL..." -ForegroundColor Yellow
Write-Host "Run: vercel env add SUPABASE_URL production" -ForegroundColor Cyan
Write-Host "Enter: https://byoqkhieazizoesflvms.supabase.co" -ForegroundColor Gray

Write-Host "`nSetting SUPABASE_KEY..." -ForegroundColor Yellow
Write-Host "Run: vercel env add SUPABASE_KEY production" -ForegroundColor Cyan
Write-Host "Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5b3FraGllYXppem9lc2Zsdm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODUzOTQsImV4cCI6MjA3MTI2MTM5NH0.OU3PPtpKdK5L51qAcuq2FlA06IF88mIjqSHqRTwGHtU" -ForegroundColor Gray

Write-Host "`nSetting fallback database variables..." -ForegroundColor Yellow

Write-Host "`nSUPABASE_DB_NAME:" -ForegroundColor Yellow
Write-Host "Run: vercel env add SUPABASE_DB_NAME production" -ForegroundColor Cyan
Write-Host "Enter: postgres" -ForegroundColor Gray

Write-Host "`nSUPABASE_DB_USER:" -ForegroundColor Yellow
Write-Host "Run: vercel env add SUPABASE_DB_USER production" -ForegroundColor Cyan
Write-Host "Enter: postgres.byoqkhieazizoesflvms" -ForegroundColor Gray

Write-Host "`nSUPABASE_DB_PASSWORD:" -ForegroundColor Yellow
Write-Host "Run: vercel env add SUPABASE_DB_PASSWORD production" -ForegroundColor Cyan
Write-Host "Enter: Sreelaltom@123" -ForegroundColor Gray

Write-Host "`nSUPABASE_DB_HOST:" -ForegroundColor Yellow
Write-Host "Run: vercel env add SUPABASE_DB_HOST production" -ForegroundColor Cyan
Write-Host "Enter: aws-1-us-east-2.pooler.supabase.com" -ForegroundColor Gray

Write-Host "`nSUPABASE_DB_PORT:" -ForegroundColor Yellow
Write-Host "Run: vercel env add SUPABASE_DB_PORT production" -ForegroundColor Cyan
Write-Host "Enter: 6543" -ForegroundColor Gray

Write-Host "`n=== INSTRUCTIONS ===" -ForegroundColor Green
Write-Host "1. Open terminal in this project directory" -ForegroundColor White
Write-Host "2. Run each 'vercel env add' command above" -ForegroundColor White
Write-Host "3. When prompted, enter the corresponding value" -ForegroundColor White
Write-Host "4. After all variables are set, redeploy: vercel --prod" -ForegroundColor White
Write-Host "5. Check deployment at: https://cetplacement-backend.vercel.app/simple-health/" -ForegroundColor White

Write-Host "`nEnvironment variables setup guide complete!" -ForegroundColor Green
