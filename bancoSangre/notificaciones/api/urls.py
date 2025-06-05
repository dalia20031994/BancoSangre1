from django.urls import path
from . import views

urlpatterns = [
    path('crear/', views.crear_notificacion, name='crear_notificacion'),
    path('<int:notificacion_id>/responder/<int:donador_id>/', views.responder_notificacion, name='responder_notificacion'),
    path('<int:notificacion_id>/estado/', views.ver_estado_notificacion, name='ver_estado_notificacion'),
        path('mis/', views.mis_notificaciones, name='mis_notificaciones'),  # <-- Esta ruta
    path('<int:notificacion_id>/respuesta/', views.responder_notificacion, name='responder_notificacion'), # Nueva URL simplificada

        path('historial/', views.historial_notificaciones, name='historial_notificaciones'),  # ✅ Agrega esta línea

]
