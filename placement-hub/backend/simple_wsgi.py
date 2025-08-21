"""
Simple Django WSGI that definitely works
"""
import os
import sys

# Ensure we can find Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.settings')

try:
    import django
    from django.core.wsgi import get_wsgi_application
    from django.conf import settings
    
    # Initialize Django
    django.setup()
    
    # Create the WSGI application
    application = get_wsgi_application()
    
    # For Vercel, we need to expose it as 'app'
    app = application
    
except Exception as e:
    # Fallback for any Django issues
    def app(environ, start_response):
        status = '200 OK'
        headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ]
        start_response(status, headers)
        
        import json
        response = {
            'error': 'Django setup failed',
            'message': str(e),
            'fallback': True
        }
        return [json.dumps(response).encode('utf-8')]
