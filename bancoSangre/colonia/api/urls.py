from rest_framework.routers import DefaultRouter
from colonia.api.views import ColoniaViewSet

router = DefaultRouter()
router.register('', ColoniaViewSet, basename='colonia')  # Dejar la cadena vacía para obtener '/api/colonia/'

urlpatterns = router.urls
