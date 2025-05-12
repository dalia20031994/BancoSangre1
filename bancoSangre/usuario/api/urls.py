from rest_framework.routers import DefaultRouter
from usuario.api.views import UsuarioViewSet
#agregado por dalia
from django.urls import path
from usuario.api.views import UsuarioAutenticadoView

router = DefaultRouter()
router.register('usuarios', UsuarioViewSet, basename='usuario')  
#Ruta para el usuario autentificado
urlpatterns = [
    path('usuario-autenticado/', UsuarioAutenticadoView.as_view(), name='usuario-autenticado'),
]
urlpatterns += router.urls