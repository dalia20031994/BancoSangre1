from django.db import models
from colonia.models import Colonia 
from coordenada.models import Coordenada

class Direccion(models.Model):
    calle = models.CharField(max_length=50)
    numInterior = models.CharField(max_length=10)
    numExterior = models.CharField(max_length=10)
    colonia = models.ForeignKey(Colonia, on_delete=models.CASCADE)
    coordenadas = models.ForeignKey(Coordenada, on_delete=models.CASCADE)


