from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from api.models import Company
import json

@require_http_methods(["GET"])
@csrf_exempt
def debug_companies(request):
    """Debug endpoint to check company data"""
    try:
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
                    'id': company.id,
                    'error': str(e),
                    'name': getattr(company, 'name', 'Unknown')
                })
        
        return JsonResponse({
            'status': 'success',
            'count': len(company_list),
            'companies': company_list,
            'model_fields': [f.name for f in Company._meta.fields]
        })
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'error': str(e),
            'type': type(e).__name__
        })
