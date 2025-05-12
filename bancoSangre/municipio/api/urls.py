from rest_framework.routers import DefaultRouter
from municipio.api.views import MunicipioViewSet

router = DefaultRouter()
router.register(r'', MunicipioViewSet, basename='municipio')


urlpatterns = router.urls