"""
URL configuration for hub project.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.utils import timezone
import sys
import os
import traceback


# -------------------------
# Simple View Functions
# -------------------------

def root_view(request):
    """Root endpoint providing API information"""
    return JsonResponse({
        "message": "CET Placement Hub API",
        "version": "1.0",
        "status": "active",
        "endpoints": {
            "health": "/simple-health/",
            "api": "/api/",
            "admin": "/admin/",
            "companies": "/api/companies/",
            "users": "/api/users/",
            "subjects": "/api/subjects/",
            "posts": "/api/posts/",
            "interviews": "/api/interviews/",
        },
        "documentation": "Visit /api/ for browsable API"
    })


def simple_health_check(request):
    """Simple health check endpoint"""
    try:
        from django.db import connection
        from api.models import UserProfile, Company
        
        # Test database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return JsonResponse({
            "status": "healthy",
            "database": "connected",
            "users": UserProfile.objects.count(),
            "companies": Company.objects.count(),
            "timestamp": str(timezone.now()) if 'timezone' in globals() else "N/A"
        })
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc(),
        }, status=500)


def vercel_test(request):
    """Vercel deployment test endpoint"""
    try:
        return JsonResponse({
            "success": True,
            "message": "Vercel deployment is working!",
            "python_version": sys.version,
            "django_settings": {
                "debug": settings.DEBUG,
                "allowed_hosts": settings.ALLOWED_HOSTS,
            },
            "environment": {
                "has_database_url": bool(os.environ.get("DATABASE_URL")),
                "has_supabase_url": bool(os.environ.get("SUPABASE_URL")),
            }
        })
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
        }, status=500)


# Simple companies bypass (no DRF)
def simple_companies_bypass(request):
    try:
        from api.models import Company
        companies = Company.objects.all().order_by("id")

        data = [{
            "id": c.id,
            "name": c.name,
            "tier": c.tier,
            "website": c.website,
            "salary_range": c.salary_range,
            "created_at": str(c.created_at),
        } for c in companies]

        return JsonResponse({
            "success": True,
            "count": len(data),
            "results": data,
        })
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
        }, status=500)


# -------------------------
# URL patterns
# -------------------------
urlpatterns = [
    path("", root_view, name="root"),  # Root endpoint
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),   # your DRF routes
    path("simple-health/", simple_health_check, name="simple_health"),
    path("vercel-test/", vercel_test, name="vercel_test"),
    path("bypass-companies/", simple_companies_bypass, name="bypass_companies"),
]
