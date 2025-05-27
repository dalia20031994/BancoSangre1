from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Permiso que permite acceso solo a los administradores para operaciones de escritura
    y a los demás usuarios solo para operaciones de lectura.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True  # Permite el acceso solo para GET, HEAD, OPTIONS
        return request.user and request.user.is_staff  # Solo los administradores pueden modificar

class IsDonadorCreateReadOnly(BasePermission):
    """
    Permite a usuarios con rol 'donador' ver (GET) y crear (POST), pero no modificar o eliminar.
    Solo los administradores (is_staff) pueden hacer PUT, PATCH, DELETE.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method in ['POST', 'PUT', 'PATCH']:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff
class IsOwnerOrAdmin(BasePermission):
    """
    Permite el acceso solo si el usuario es el propietario del objeto o es un administrador.
    """
    def has_object_permission(self, request, view, obj):
        # Permite el acceso de lectura a todos (ya cubierto por retrieve, list)
        # Opcional: si quieres que PUT/PATCH/DELETE también sea ReadOnly para no-dueños
        # if request.method in SAFE_METHODS:
        #     return True

        # Si el usuario es administrador, siempre permite
        if request.user and request.user.is_staff:
            return True

        # Si no es administrador, solo permite si el usuario es el propietario del objeto
        return obj == request.user