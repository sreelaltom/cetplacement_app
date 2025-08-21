from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from api.models import Company
import json
import traceback
import os

@require_http_methods(["GET"])
@csrf_exempt
def debug_companies(request):
    """Debug endpoint to check company data and environment"""
    try:
        # Check environment variables
        env_vars = {
            'DATABASE_URL': bool(os.getenv('DATABASE_URL')),
            'DJANGO_SECRET_KEY': bool(os.getenv('DJANGO_SECRET_KEY')),
            'ALLOWED_HOSTS': os.getenv('ALLOWED_HOSTS', 'Not set'),
            'DEBUG': os.getenv('DEBUG', 'Not set'),
        }
        
        # Check database connection
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_connected = True
            
        # Check table exists
        try:
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='api_company'")
            table_columns = [row[0] for row in cursor.fetchall()]
        except:
            table_columns = []
            
        # Get raw company data
        companies = Company.objects.all()
        company_list = []
        
        for company in companies:
            try:
                company_dict = {
                    'id': company.id,
                    'name': company.name,
                    'website': getattr(company, 'website', None),
                    'tier': getattr(company, 'tier', None),
                    'salary_range': getattr(company, 'salary_range', None),
                    'created_at': str(company.created_at) if hasattr(company, 'created_at') else None,
                }
                company_list.append(company_dict)
            except Exception as e:
                company_list.append({
                    'id': getattr(company, 'id', 'Unknown'),
                    'error': str(e),
                    'name': getattr(company, 'name', 'Unknown')
                })
        
        return JsonResponse({
            'status': 'success',
            'environment': env_vars,
            'database_connected': db_connected,
            'table_columns': table_columns,
            'model_fields': [f.name for f in Company._meta.fields],
            'company_count': len(company_list),
            'companies': company_list,
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'error': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc(),
        })
