"""
Minimal WSGI to test database connectivity on Vercel
"""
import os
import sys
import json

# Ensure we can find Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.settings')

def app(environ, start_response):
    try:
        import django
        from django.conf import settings
        
        # Initialize Django
        django.setup()
        
        # Test database configuration
        db_config = settings.DATABASES['default']
        
        response_data = {
            'status': 'success',
            'database_engine': db_config['ENGINE'],
            'database_name': db_config.get('NAME', 'not set'),
            'database_host': db_config.get('HOST', 'not set'),
            'debug_mode': settings.DEBUG,
            'environment_vars': {
                'DATABASE_URL': 'set' if os.environ.get('DATABASE_URL') else 'not set',
                'SUPABASE_DB_PASSWORD': 'set' if os.environ.get('SUPABASE_DB_PASSWORD') else 'not set',
                'USE_SQLITE': os.environ.get('USE_SQLITE', 'not set'),
            }
        }
        
        # Try to test database connection
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            response_data['database_connection'] = 'success'
        except Exception as db_error:
            response_data['database_connection'] = 'failed'
            response_data['database_error'] = str(db_error)
        
        status = '200 OK'
        headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
        ]
        start_response(status, headers)
        
        return [json.dumps(response_data, indent=2).encode('utf-8')]
        
    except Exception as e:
        status = '500 Internal Server Error'
        headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', '*'),
        ]
        start_response(status, headers)
        
        error_data = {
            'status': 'error',
            'error': 'Django setup failed',
            'message': str(e),
            'type': type(e).__name__
        }
        return [json.dumps(error_data, indent=2).encode('utf-8')]
