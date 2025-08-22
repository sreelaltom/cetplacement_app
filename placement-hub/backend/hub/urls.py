"""
URL configuration for hub project.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
import sys
import traceback

# Health check endpoint (no DB)
def simple_health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "Django is running",
        "debug": settings.DEBUG,
        "python_version": sys.version,
    })


# Vercel deployment test
def vercel_test(request):
    try:
        import os
        return JsonResponse({
            "status": "success",
            "message": "Django app is running on Vercel",
            "python_version": sys.version,
            "django_settings": os.environ.get("DJANGO_SETTINGS_MODULE", "Not set"),
            "environment": "production" if not settings.DEBUG else "development",
        })
    except Exception as e:
        return JsonResponse({
            "status": "error",
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


# Import schema fix view
from api.fix_schema import fix_company_schema


# -------------------------
# URL patterns
# -------------------------
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),   # your DRF routes
    path("simple-health/", simple_health_check, name="simple_health"),
    path("vercel-test/", vercel_test, name="vercel_test"),
    path("bypass-companies/", simple_companies_bypass, name="bypass_companies"),
    path("fix-schema/", fix_company_schema, name="fix_schema"),
]
