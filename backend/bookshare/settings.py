from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os

# Define the base directory to point to the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Explicitly load the .env file
dotenv_path = BASE_DIR / '.env'
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    print(f"WARNING: .env file not found at {dotenv_path}")

# Settings loaded from .env
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')


# Installed applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Custom app
    'books',
    # Third-party apps
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
]

# Middleware definition
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS support
]

# Django REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # JWT authentication
    ),
}

# Allowed origins for CORS (development and production)
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', "http://localhost:3000").split(',')

# URL configuration
ROOT_URLCONF = 'bookshare.urls'

# Template settings
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

# WSGI application
WSGI_APPLICATION = 'bookshare.wsgi.application'

# JWT token settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),  # Access token lifetime
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),  # Refresh token lifetime
    'ROTATE_REFRESH_TOKENS': False,  # Disable token rotation
    'BLACKLIST_AFTER_ROTATION': True,  # Blacklist tokens after rotation
    'ALGORITHM': 'HS256',  # Encryption algorithm
    'AUTH_HEADER_TYPES': ('Bearer',),  # Header type
}

# Database settings
# See: https://docs.djangoproject.com/en/5.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'bookshare_db'),  # Database name
        'USER': os.getenv('DB_USER', 'peti'),  # Database user
        'PASSWORD': os.getenv('DB_PASSWORD', 'Fakard11'),  # Database password
        'HOST': os.getenv('DB_HOST', 'localhost'),  # Database host
        'PORT': os.getenv('DB_PORT', '5432'),  # Database port
    }
}

# Password validation
# See: https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization settings (i18n)
# See: https://docs.djangoproject.com/en/5.1/topics/i18n/
LANGUAGE_CODE = 'en-us'  # Default language
TIME_ZONE = 'UTC'  # Time zone
USE_I18N = True  # Internationalization support
USE_TZ = True  # Time zone handling

# Static files (CSS, JavaScript, Images)
# See: https://docs.djangoproject.com/en/5.1/howto/static-files/
STATIC_URL = 'static/'  # Default URL for static files

# Default primary key field type
# See: https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# HTTPS settings (recommended for production)
SECURE_SSL_REDIRECT = not DEBUG  # Automatically redirect to HTTPS when not in debug mode
SECURE_HSTS_SECONDS = 3600  # HSTS header validity
SECURE_HSTS_INCLUDE_SUBDOMAINS = True  # Include subdomains in HSTS
SECURE_HSTS_PRELOAD = True  # Allow preloading of HSTS
SESSION_COOKIE_SECURE = True  # Session cookie only via HTTPS
CSRF_COOKIE_SECURE = True  # CSRF cookie only via HTTPS