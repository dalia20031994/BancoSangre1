from rest_framework.routers import DefaultRouter
from direccion.api.views import DireccionViewSet

router = DefaultRouter()
router.register('direcciones', DireccionViewSet, basename='direccion')  # Usamos UsuarioViewSet con mayúscula
urlpatterns = router.urls
