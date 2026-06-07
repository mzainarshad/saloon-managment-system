from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

# Use console email backend in dev
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Allow all CORS origins in dev
CORS_ALLOW_ALL_ORIGINS = True