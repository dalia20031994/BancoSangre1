from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rol.models import Rol

class UsuarioManager(BaseUserManager):
    def create_user(self, nombre_usuario, correo, contraseña=None, **extra_fields):
        if not correo:
            raise ValueError('El correo es obligatorio')
        correo = self.normalize_email(correo)
        user = self.model(nombre_usuario=nombre_usuario, correo=correo, **extra_fields)
        if contraseña:  # Verifica si la contraseña fue proporcionada
            user.set_password(contraseña)  # Encripta la contraseña antes de guardarla
        user.save(using=self._db)
        return user

    def create_superuser(self, nombre_usuario, correo, contraseña=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(nombre_usuario, correo, contraseña, **extra_fields)

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class Usuario(AbstractBaseUser, PermissionsMixin):
    nombre_usuario = models.CharField(max_length=30, unique=True)
    correo = models.EmailField(unique=True)
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino')])
    rol = models.ForeignKey('rol.Rol', on_delete=models.CASCADE, default=1)  # Asignar un valor por defecto para rol
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre_usuario']

    def __str__(self):
        return self.nombre_usuario
