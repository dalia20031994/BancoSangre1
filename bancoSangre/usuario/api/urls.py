from rest_framework.routers import DefaultRouter
from usuario.api.views import UsuarioViewSet

router = DefaultRouter()
router.register('usuarios', UsuarioViewSet, basename='usuario')  
urlpatterns = router.urls


