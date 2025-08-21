from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Company
import traceback

@require_http_methods(["GET"])
@csrf_exempt
def simple_company_list(request):
    """Ultra simple company list view"""
    try:
        companies = Company.objects.all()
        data = {
            'count': companies.count(),
            'results': []
        }
        
        for company in companies:
            try:
                data['results'].append({
                    'id': company.id,
                    'name': str(company.name),
                })
            except Exception as e:
                data['results'].append({
                    'id': getattr(company, 'id', 'unknown'),
                    'error': f'Failed to serialize company: {str(e)}'
                })
        
        return JsonResponse(data)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc()
        }, status=500)
