"""
Django settings for hub project.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
import logging

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Secret key
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-your-secret-key-here')

# Debug
DEBUG = os.environ.get('DEBUG', 'False').lower() in ['true', '1', 'yes']

# Logging
logger = logging.getLogger(__name__)
logger.info(f"Django starting with DEBUG={DEBUG}")
logger.info(f"DATABASE_URL present: {bool(os.environ.get('DATABASE_URL'))}")

# Allowed hosts
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.vercel.app',
    '.railway.app',
    '.render.com',
    'cetplacement-app.vercel.app',
    'cetplacement-backend.vercel.app',
]

# Installed apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

# Middleware (CORS must be first!)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',   # ✅ must be at the top
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # put whitenoise just after security
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hub.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hub.wsgi.application'


# -------------------
# Database
# -------------------
if not DEBUG:
    # Production: require DATABASE_URL
    if os.environ.get('DATABASE_URL'):
        DATABASES = {
            'default': dj_database_url.parse(
                os.environ['DATABASE_URL'],
                conn_max_age=60,
                conn_health_checks=True
            )
        }
    else:
        raise ValueError("DATABASE_URL environment variable is required in production")
else:
    # Development
    if os.environ.get('DATABASE_URL'):
        DATABASES = {
            'default': dj_database_url.parse(
                os.environ['DATABASE_URL'],
                conn_max_age=60,
                conn_health_checks=True
            )
        }
        print("Development: Using Supabase/Postgres via DATABASE_URL")
    else:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
        print("Development: Using SQLite")


# -------------------
# Password validation
# -------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# -------------------
# Internationalization
# -------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True


# -------------------
# Static files
# -------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# -------------------
# Django REST Framework
# -------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.authentication.SupabaseAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}


# -------------------
# CORS settings
# -------------------
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://cetplacement-app.vercel.app",
    "https://cetplacement-backend.vercel.app",
]

# Add custom frontend if set
if os.environ.get('FRONTEND_URL'):
    CORS_ALLOWED_ORIGINS.append(os.environ['FRONTEND_URL'])

# In production, fallback to allow all (temporary)
if not DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True


# -------------------
# Supabase configuration
# -------------------
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_ANON_KEY', '')
