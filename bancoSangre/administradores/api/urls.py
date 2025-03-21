from rest_framework.routers import DefaultRouter
from administradores.api.views import AdministradoresViewSet  # Corregido a mayúscula inicial

router = DefaultRouter()
router.register('administradores', AdministradoresViewSet, basename='administrador')
urlpatterns = router.urls
