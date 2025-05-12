from django.urls import path, include
from rest_framework.routers import DefaultRouter
from donador.api.views import DonadorViewSet, DonadorPorUsuarioAPIView


router = DefaultRouter()
router.register('', DonadorViewSet, basename='donador')  # Cambié 'donadores' a ''

urlpatterns = [
    path('', include(router.urls)),  # Con esta configuración la ruta será /api/donador/
    path('usuario/<int:usuario_id>/', DonadorPorUsuarioAPIView.as_view(), name='donador-por-usuario'),
]
