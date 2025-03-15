from django.db import models

# Create your models here.
from django.db import models

class donadores(models.Model):
    id_donador = models.AutoField(primary_key=True)  
    nombre = models.CharField(max_length=15) 
    apellidoP = models.CharField(max_length=15)
    apellidoM = models.CharField(max_length=15)
    telefono = models.CharField(max_length=10)  
    direccion = models.TextField(max_length=100) 
    edad = models.PositiveIntegerField()  
    sexo = models.CharField(max_length=10, choices=[('M', 'Masculino'), ('F', 'Femenino')])  
    usuario = models.CharField(max_length=30, unique=True)  
    contraseña = models.CharField(max_length=25)  
    tipoSangre = models.CharField(max_length=5)  
    correo = models.EmailField(unique=True) 

    def __str__(self):
        return f"{self.nombre} {self.apellidoP}"

