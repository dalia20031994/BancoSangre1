from django.db import models

class Administrador(models.Model):
    idcuenta = models.AutoField(primary_key=True)
    nombre_usuario = models.CharField(max_length=30, unique=True)
    contraseña = models.CharField(max_length=25)
    correo_electronico = models.EmailField(unique=True)

    def __str__(self):
        return self.nombre_usuario

