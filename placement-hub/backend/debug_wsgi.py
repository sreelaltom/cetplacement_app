"""
Debug WSGI for Vercel deployment - minimal Django setup
"""
import os
import sys
import json

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.settings')

def debug_app(environ, start_response):
    """Simple debug WSGI app to test deployment"""
    try:
        # Try to import Django
        import django
        from django.conf import settings
        
        # Initialize Django
        django.setup()
        
        response_data = {
            'status': 'Django loaded successfully',
            'debug': settings.DEBUG,
            'database': {
                'engine': settings.DATABASES['default']['ENGINE'],
                'name': str(settings.DATABASES['default']['NAME'])
            },
            'installed_apps': list(settings.INSTALLED_APPS),
            'environment': {
                'DJANGO_SETTINGS_MODULE': os.environ.get('DJANGO_SETTINGS_MODULE'),
                'USE_SQLITE': os.environ.get('USE_SQLITE'),
                'DEBUG': os.environ.get('DEBUG')
            }
        }
        
        status = '200 OK'
        headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
        ]
        
    except Exception as e:
        response_data = {
            'status': 'error',
            'error': str(e),
            'error_type': type(e).__name__,
            'python_path': sys.path[:3]
        }
        status = '500 Internal Server Error'
        headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
        ]
    
    start_response(status, headers)
    return [json.dumps(response_data, indent=2).encode('utf-8')]

# Export as app for Vercel
app = debug_app
