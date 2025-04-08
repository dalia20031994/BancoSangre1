from django.db import models
from rol.models import Rol 
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    nombre_usuario = models.CharField(max_length=30, unique=True)
    correo = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=128)  
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino')])
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        if not self.pk:  
            self.contraseña = make_password(self.contraseña)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.nombre_usuario
    
    