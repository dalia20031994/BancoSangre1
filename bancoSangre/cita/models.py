from django.db import models
from donador.models import Donador    # <<–– IMPORTA el modelo real

class Cita(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]

    donador = models.ForeignKey(Donador, on_delete=models.CASCADE)
    fecha   = models.DateField()
    hora    = models.TimeField()
    estado  = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')

    def __str__(self):
        return f'Cita #{self.id} - {self.fecha} {self.hora}'
