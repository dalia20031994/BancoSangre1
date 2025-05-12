from rest_framework.routers import DefaultRouter
from direccion.api.views import DireccionViewSet

router = DefaultRouter()
router.register('direcciones', DireccionViewSet, basename='direccion')   # <-- nota que es cadena vacía ''

urlpatterns = router.urls