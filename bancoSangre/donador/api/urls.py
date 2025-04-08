from rest_framework.routers import DefaultRouter
from donador.api.views import DonadorViewSet

router = DefaultRouter()
router.register('donadores', DonadorViewSet, basename='direccion')  # Usamos UsuarioViewSet con mayúscula
urlpatterns = router.urls
