from django.db import models

# Create your models here.
from django.db import models

class donadores(models.Model):
    id_donador = models.AutoField(primary_key=True)  # Clave primaria autoincremental
    nombre = models.CharField(max_length=15)  # Se amplió para nombres largos
    apellidoP = models.CharField(max_length=15)
    apellidoM = models.CharField(max_length=15)
    telefono = models.CharField(max_length=10)  # Tamaño suficiente para números con prefijo
    direccion = models.TextField(max_length=100)  # Campo tipo texto para direcciones largas
    edad = models.PositiveIntegerField()  # Edad como número positivo
    sexo = models.CharField(max_length=10, choices=[('M', 'Masculino'), ('F', 'Femenino')])  # Opciones para mayor control
    usuario = models.CharField(max_length=30, unique=True)  # Se amplió y agregó `unique=True`
    contraseña = models.CharField(max_length=25)  # Se amplió para mayor seguridad
    tipoSangre = models.CharField(max_length=5)  # Ejemplo: "O+", "A-", "AB+"
    correo = models.EmailField(unique=True)  # EmailField con validación y único

    def __str__(self):
        return f"{self.nombre} {self.apellidoP}"

