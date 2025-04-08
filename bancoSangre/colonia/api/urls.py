from rest_framework.routers import DefaultRouter
from colonia.api.views import ColoniaViewSet

router = DefaultRouter()
router.register('colonias', ColoniaViewSet, basename='colonia')  # Usamos UsuarioViewSet con mayúscula
urlpatterns = router.urls
