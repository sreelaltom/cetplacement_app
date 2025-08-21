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

try:
    from django.core.wsgi import get_wsgi_application
    app = get_wsgi_application()  # Use 'app' instead of 'application' for Vercel
except Exception as e:
    # Fallback WSGI application for debugging
    def app(environ, start_response):
        status = '500 Internal Server Error'
        headers = [
            ('Content-type', 'text/plain'),
            ('Access-Control-Allow-Origin', '*')
        ]
        start_response(status, headers)
        error_msg = f"Django WSGI Error: {str(e)}\nPython path: {sys.path[:3]}\nCurrent dir: {current_dir}"
        return [error_msg.encode('utf-8')]
