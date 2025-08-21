"""
Minimal Django WSGI for Vercel deployment
"""
import os
import sys

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.settings')

# Initialize app variable
app = None

try:
    from django.core.wsgi import get_wsgi_application
    app = get_wsgi_application()  # Use 'app' instead of 'application' for Vercel
except Exception as e:
    # Fallback WSGI application for debugging
    def fallback_app(environ, start_response):
        status = '500 Internal Server Error'
        headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ]
        start_response(status, headers)
        
        import json
        error_data = {
            'error': 'Django WSGI setup failed',
            'message': str(e),
            'python_path': sys.path[:3],
            'current_dir': current_dir,
            'environment': {
                'DJANGO_SETTINGS_MODULE': os.environ.get('DJANGO_SETTINGS_MODULE'),
                'DEBUG': os.environ.get('DEBUG'),
                'USE_SQLITE': os.environ.get('USE_SQLITE')
            }
        }
        return [json.dumps(error_data, indent=2).encode('utf-8')]
    
    app = fallback_app
