from django.db import models
from donador.models import Donador
from cita.models import Cita

class Donacion(models.Model):
    donador = models.ForeignKey(Donador, on_delete=models.CASCADE)
    cita = models.OneToOneField(Cita, on_delete=models.CASCADE)
    fecha_donacion = models.DateField(auto_now_add=True)
    cantidad_litros = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    lugar_donacion = models.CharField(max_length=255, blank=True)
    observaciones = models.TextField(blank=True)
    dono = models.BooleanField(default=True)

    def __str__(self):
        return f"Donación de {self.donador} en cita {self.cita}"
