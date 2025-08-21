"""
Django WSGI entry point for Vercel deployment
Alternative entry point that Vercel might prefer
"""
import os
import sys

# Add the parent directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.production_settings')

# Import and setup Django
import django
django.setup()

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create the WSGI application
application = get_wsgi_application()

# Vercel expects this variable name
app = application
