from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from usuario.models import Usuario
from usuario.api.serializer import UsuarioSerializer

#Agregado por dalia para obtener los datos del usuario logeado
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response



class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action == 'create':  # Permitir POST para crear usuario
            return [AllowAny()]  # Permite que cualquiera cree un usuario
        elif self.action == 'list':  # Permitir GET para ver todos los usuarios
            return [AllowAny()]  # Permite que cualquiera vea los usuarios
        return [IsAdminUser()]  # Requiere ser admin para los demás métodos (update, destroy, etc.) <

#para el usuario logeado
class UsuarioAutenticadoView(APIView):
    # Configuramos para permitir solo acceso con un token válido
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # Obtener el usuario actual desde el token
        user = request.user
        
        # Obtener detalles del usuario
        user_data = {
            'id': user.id,
            'nombre_usuario': user.nombre_usuario,
            'correo': user.correo,
            'rol': user.rol.nombre,
        }
        
        return Response(user_data)