# 🩸 Sistema de Gestión de Donadores de Sangre

---

## 🚀 Guía de Configuración del Proyecto

### 🔁 1. Clonación del Repositorio

```bash
# Clona el repositorio
git clone <url_del_repositorio>

# Lista todas las ramas disponibles
git branch -a

# Cambia a la rama de trabajo
git checkout <nombre_rama>
```

---

### 🐍 2. Configuración del Entorno Virtual e Instalación de Dependencias

> ⚠️ Esto solo es necesario después de hacer un `pull` del repositorio remoto.

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar requerimientos
pip install -r requirements.txt
```

---

### 🗂️ 3. Migraciones de la Base de Datos

Ejecuta las migraciones **en este orden** para que todo funcione correctamente:

```bash
python manage.py migrate rol
python manage.py migrate usuario
python manage.py migrate municipio
python manage.py migrate colonia
python manage.py migrate coordenada
python manage.py migrate direccion
python manage.py migrate donador
python manage.py migrate
```

#### 🧹 Nota: Si necesitas borrar y crear una nueva base de datos desde `psql`:

```bash
# Entra a psql
psql

# Lista las bases de datos
\l

# Borra la base de datos existente
DROP DATABASE nombre_base;

# Crea una nueva base de datos
CREATE DATABASE nombre_base;

# Verifica que se haya creado
\l
```

---

### 🛡️ 4. Creación de Roles

```bash
# Abre la consola de Django
python manage.py shell
```

Dentro de la consola de Python:

```python
from rol.models import Rol

# Crear roles
admin_role = Rol.objects.create(nombre='admin', permisos=['create', 'read', 'update', 'delete'])
donador_role = Rol.objects.create(nombre='donador', permisos=['read', 'create'])

# Verificar usuario y sus permisos
from usuario.models import Usuario
usuario = Usuario.objects.get(correo='dalia@gmail.com')
print(f"Nombre de usuario: {usuario.nombre_usuario}")
print(f"Rol del usuario: {usuario.rol.nombre}")
print(f"Permisos del rol: {usuario.rol.permisos}")

# Listar todos los roles
Rol.objects.all()
```

👉 Para salir de la consola:
```
CTRL + Z y ENTER
```

---

### 🧑‍💻 5. Creación del Superusuario

```bash
# Crear superusuario
python manage.py createsuperuser
```

> 📌 Usa estos datos recomendados:

- **Correo:** `admin@gmail.com`  
- **Usuario:** `admin`  
- **Contraseña:** `admin1234`  
- **Rol:** `1`  

#### 🔑 Generar Token JWT

```python
from usuario.models import Usuario
from rest_framework_simplejwt.tokens import RefreshToken

usuario = Usuario.objects.get(correo='admin@gmail.com')
refresh = RefreshToken.for_user(usuario)

print(f'Refresh Token: {refresh}')
print(f'Access Token: {refresh.access_token}')
```

---

### ▶️ 6. Ejecutar el Proyecto

```bash
python manage.py runserver
```

---

### 📫 7. Verificación con Postman

1. Abre Postman y ve a la pestaña **Authorization**.
2. Selecciona `Bearer Token` y pega el `Access Token` generado.
3. Realiza tus peticiones a las rutas protegidas.

```python
from usuario.models import Usuario

usuario = Usuario.objects.get(correo='dalia@gmail.com')
print(f"Nombre de usuario: {usuario.nombre_usuario}")
print(f"Rol del usuario: {usuario.rol.nombre}")
print(f"Permisos del rol: {usuario.rol.permisos}")
```

---


    Desarrollado por el equipo 3 — @MicheRomero3012 & @dalia20031994 💻❤️
