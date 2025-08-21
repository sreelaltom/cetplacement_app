"""
WSGI config for hub project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Set the settings module for production on Vercel
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.production_settings')

application = get_wsgi_application()

# ✅ Vercel looks for `app`
app = application
