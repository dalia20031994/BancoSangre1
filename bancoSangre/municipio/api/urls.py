from rest_framework.routers import DefaultRouter
from municipio.api.views import MunicipioViewSet

router = DefaultRouter()
router.register('municipios', MunicipioViewSet, basename='municipio')  # Usamos UsuarioViewSet con mayúscula
urlpatterns = router.urls
