from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .debug_views import debug_companies
from .minimal_views import simple_company_list
from .debug_schema import debug_company_schema

# Simple view to bypass serializer
from django.http import JsonResponse
from .models import Company

def simple_companies(request):
    """Simple company list without serializer"""
    try:
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
        return JsonResponse({'companies': data, 'count': len(data)})
    except Exception as e:
        import traceback
        return JsonResponse({
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=500)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'branches', views.BranchViewSet)
router.register(r'users', views.UserProfileViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'companies', views.CompanyViewSet)
router.register(r'experiences', views.InterviewExperienceViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('debug/companies/', debug_companies, name='debug_companies'),
    path('debug/schema/', debug_company_schema, name='debug_schema'),
    path('simple/companies/', simple_companies, name='simple_companies'),
    path('minimal/companies/', simple_company_list, name='minimal_companies'),
    path('', include(router.urls)),
]
