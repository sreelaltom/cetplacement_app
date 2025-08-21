#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Make migrations (if needed)
python manage.py makemigrations --noinput

# Apply migrations
python manage.py migrate --noinput
