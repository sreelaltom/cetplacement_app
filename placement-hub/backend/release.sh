#!/bin/bash

# release.sh - Deployment script for Vercel
# This script handles migrations and static file collection

echo "Starting deployment process..."

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Create superuser if it doesn't exist
echo "Setting up superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
from api.models import UserProfile
import os

User = get_user_model()
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', email, password)
    print('Superuser created successfully')
else:
    print('Superuser already exists')
"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Deployment process completed!"
