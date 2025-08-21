#!/bin/bash
# Build script for Vercel deployment

echo "Starting build process..."

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Set environment variables
export DJANGO_SETTINGS_MODULE=hub.production_settings

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Build completed successfully!"
