from django.urls import path, include
from rest_framework.routers import DefaultRouter
from donacion.api.views import DonacionViewSet, donaciones_de_semana

router = DefaultRouter()
router.register(r'donaciones', DonacionViewSet, basename='donacion')

urlpatterns = [
    path('', include(router.urls)),
    path('donaciones/semana/', donaciones_de_semana, name='donaciones-de-semana'),
]
