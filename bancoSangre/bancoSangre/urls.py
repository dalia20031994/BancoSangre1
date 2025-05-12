"""
URL configuration for bancoSangre project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from usuario.api.views import UsuarioViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # JWT endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Rutas específicas por app
    path('api/rol/', include('rol.api.urls')),
    path('api/municipio/', include('municipio.api.urls')),
    path('api/colonia/', include('colonia.api.urls')),
    path('api/coordenada/', include('coordenada.api.urls')),
    path('api/direccion/', include('direccion.api.urls')),
    path('api/donador/', include('donador.api.urls')),
    #agregado por dalia para obtener el usuario logado
    path('api/', include('usuario.api.urls')),
]
