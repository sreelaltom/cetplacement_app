"""
Simple Vercel entry point for Django app
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.production_settings')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create the application
application = get_wsgi_application()

# Vercel expects 'app'
app = application
