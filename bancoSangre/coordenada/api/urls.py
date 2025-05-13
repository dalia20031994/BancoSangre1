from rest_framework.routers import DefaultRouter
from coordenada.api.views import CoordenadaViewSet

router = DefaultRouter()
router.register('', CoordenadaViewSet, basename='coordenada')  # RUTA VACÍA = raíz del path "coordenada/"

urlpatterns = router.urls