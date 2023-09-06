from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from .router import router

from .views import MeView

urlpatterns = [
    path('api/v1/auth/login/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/login/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/me/', MeView.as_view(), name='me'),

    path('api/v1/drf/', include(router.urls)),

    #  path('api-auth/', include('rest_framework.urls', namespace='rest_framework')) # agrega login y logout
]
