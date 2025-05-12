from django.db import models

class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    permisos = models.JSONField(default=list)  # Lista de permisos para cada rol

    def __str__(self):
        return self.nombre

