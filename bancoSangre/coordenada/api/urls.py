from rest_framework.routers import DefaultRouter
from coordenada.api.views import CoordenadaViewSet

router = DefaultRouter()
router.register('coordenadas', CoordenadaViewSet, basename='coordenada')  # Usamos UsuarioViewSet con mayúscula
urlpatterns = router.urls
