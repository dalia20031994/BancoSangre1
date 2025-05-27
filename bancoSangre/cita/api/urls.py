from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CitaViewSet, CitasPorDonador

router = DefaultRouter()
router.register('', CitaViewSet, basename='cita')  # Rutas CRUD base en /api/cita/

urlpatterns = [
    # Endpoint personalizado para obtener citas de un donador
    path('donador/<int:donador_id>/', CitasPorDonador.as_view(), name='citas-por-donador'),

    # Incluimos las rutas del router (CRUD de citas)
    path('', include(router.urls)),
]
