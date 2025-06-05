from django.db import models
from donador.models import Donador

class Notificacion(models.Model):
    titulo = models.CharField(max_length=100)
    mensaje = models.TextField()
    tipo_sangre = models.CharField(max_length=3)
    litros_requeridos = models.FloatField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} ({self.tipo_sangre})"


class NotificacionDonador(models.Model):
    notificacion = models.ForeignKey(Notificacion, on_delete=models.CASCADE, related_name='respuestas')
    donador = models.ForeignKey(Donador, on_delete=models.CASCADE)

    estado = models.CharField(
        max_length=10,
        choices=[('pendiente', 'Pendiente'), ('aceptada', 'Aceptada'), ('rechazada', 'Rechazada')],
        default='pendiente'
    )
    hora_llegada = models.DateTimeField(null=True, blank=True)
    fecha_respuesta = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.donador} -> {self.notificacion} [{self.estado}]"