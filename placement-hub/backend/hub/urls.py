"""
URL configuration for hub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
import sys

def simple_health_check(request):
    """Simple health check that doesn't require database"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Django is running',
        'debug': settings.DEBUG,
        'python_version': sys.version
    })

def simple_companies_bypass(request):
    """Simple companies endpoint bypassing DRF"""
    try:
        from api.models import Company
        companies = Company.objects.all()
        data = []
        for c in companies:
            data.append({
                'id': c.id,
                'name': c.name,
                'tier': c.tier,
                'website': c.website,
                'salary_range': c.salary_range,
                'created_at': str(c.created_at)
            })
        return JsonResponse({
            'success': True,
            'count': len(data),
            'results': data
        })
    except Exception as e:
        import traceback
        return JsonResponse({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=500)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('simple-health/', simple_health_check, name='simple_health'),
    path('bypass-companies/', simple_companies_bypass, name='bypass_companies'),
]
