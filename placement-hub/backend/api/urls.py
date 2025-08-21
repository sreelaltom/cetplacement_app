from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

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
    path('', include(router.urls)),
]
