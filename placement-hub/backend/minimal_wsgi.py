"""
Minimal Python WSGI application for Vercel testing
"""
import os
import sys

def app(environ, start_response):
    """Minimal WSGI application - using 'app' variable name for Vercel"""
    
    # Handle preflight OPTIONS requests
    if environ['REQUEST_METHOD'] == 'OPTIONS':
        status = '200 OK'
        headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
            ('Access-Control-Max-Age', '86400')
        ]
        start_response(status, headers)
        return [b'']
    
    status = '200 OK'
    headers = [
        ('Content-type', 'application/json'),
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    ]
    start_response(status, headers)
    
    response_data = {
        'status': 'success',
        'message': 'Python WSGI is working',
        'method': environ['REQUEST_METHOD'],
        'path': environ['PATH_INFO'],
        'python_version': sys.version,
        'environment_variables': {
            'DJANGO_SETTINGS_MODULE': os.environ.get('DJANGO_SETTINGS_MODULE'),
            'DEBUG': os.environ.get('DEBUG'),
            'USE_SQLITE': os.environ.get('USE_SQLITE')
        },
        'current_directory': os.getcwd(),
        'python_path': sys.path[:5]
    }
    
    import json
    return [json.dumps(response_data, indent=2).encode('utf-8')]
