from django.db import models
from usuario.models import Usuario
from direccion.models import Direccion

# Create your models here.
class Donador(models.Model):
    nombre = models.CharField(max_length=100)
    apellidoP = models.CharField(max_length=100)
    apellidoM = models.CharField(max_length=100)
    edad = models.IntegerField()
    primeraDonacion = models.DateField()
    ultimaDonacion = models.DateField()
    tipoSangre = models.CharField(max_length=5)
    peso = models.DecimalField(max_digits=5, decimal_places=2)
    estado = models.BooleanField()
    telefonoUno = models.CharField(max_length=15)
    telefonoDos = models.CharField(max_length=15, null=True, blank=True)
    direccion = models.ForeignKey(Direccion, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    