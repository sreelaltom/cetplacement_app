#!/bin/bash

echo "Starting build process..."

# Install dependencies
echo "Installing Python dependencies..."
pip install --only-binary=all --constraint constraints.txt -r requirements.txt

# Run migrations to create database
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build process completed successfully!"
