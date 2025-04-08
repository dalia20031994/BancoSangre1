from django.db import models
from municipio.models import Municipio

class Colonia(models.Model):
    nombre = models.CharField(max_length=100)
    municipio = models.ForeignKey(Municipio, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre