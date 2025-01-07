# urls.py: URL útvonalak megadása
# A BookViewSet útvonala, továbbá a regisztráció és token útvonalak.

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from books.views import BookViewSet, RegisterView, current_user, FavouriteViewSet, Favourite
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# DefaultRouter: automatikusan generál útvonalakat a ViewSet-ek számára
router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'favourites', FavouriteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),   # API végpontok a router alapján
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/current_user/', current_user, name='current_user'),
]
