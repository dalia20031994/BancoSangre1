from django.db import models

# Create your models here.
class Coordenada(models.Model):
    latitud = models.CharField(max_length=100)
    longitud = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.latitud}, {self.longitud}"
    
