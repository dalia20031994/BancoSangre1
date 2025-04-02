# Manual de Instalación y Configuración del Proyecto BancoSangre

## 1. Clonación del Repositorio con Todas las Ramas

### Clonar el repositorio con todas sus ramas remotas

Para clonar el repositorio completo con todas las ramas, utiliza el siguiente comando:

```bash
git clone --branch main https://github.com/MicheRomero3012/BancoSangre.git
```

> Esto descarga el repositorio y te coloca directamente en la rama `main`. Al usar `--branch main`, te aseguras de clonar desde la rama principal.

### Verificar las ramas disponibles

Una vez que el repositorio se haya clonado, puedes listar todas las ramas disponibles:

```bash
git branch -a
```

> Esto mostrará tanto las ramas locales como las remotas. Las ramas remotas estarán listadas como `remotes/origin/nombre_de_rama`.

### Cambiar a otra rama

Para cambiar a una rama diferente (por ejemplo, la rama `frontend`), utiliza el siguiente comando:

```bash
git checkout frontend
```

> Esto cambiará tu rama activa a `frontend`.

### Actualizar las ramas remotas

Si quieres asegurarte de que tienes todas las actualizaciones de las ramas remotas, puedes ejecutar:

```bash
git fetch
```

> Esto actualizará tu repositorio local con las ramas y los cambios más recientes desde el repositorio remoto.

---

## 2. Creación del Entorno Virtual

### En Windows

Ejecuta en la terminal:

```bash
python -m venv venv
venv\Scripts\activate
```

### En Ubuntu / Linux

Ejecuta en la terminal:

```bash
python3 -m venv venv
source venv/bin/activate
```

> El entorno virtual ahora está activo y verás un prefijo `(venv)` en tu terminal.

### Instalar las dependencias

Asegúrate de tener el archivo `requirements.txt` en la raíz del repositorio. Luego, instala las dependencias:

```bash
pip install -r requirements.txt
```

---

## 3. Instalación de PostgreSQL y `psycopg2`

Para conectar Django con PostgreSQL, primero instala `psycopg2`:

```bash
pip install psycopg2
```

---

## 4. Configuración de la Base de Datos `bancodb` en PostgreSQL

### Abrir la Consola de PostgreSQL

- Abre la consola de comandos **"SQL Shell (psql)"**
- Proporciona la siguiente información:
  - **Server:** `localhost`
  - **Database:** (Presiona `Enter` para dejar el valor por defecto)
  - **Port:** (Presiona `Enter` para dejar el valor por defecto)
  - **Username:** `postgres`
  - **Password:** Introducir la contraseña configurada previamente.

### Crear la base de datos `bancodb`

```sql
CREATE DATABASE bancodb;
```

### Conectar a la base de datos

```sql
\c bancodb
```

### Verificar la estructura de las bases de datos

Para confirmar que la base de datos se creó correctamente:

```sql
\dt
```

---

## 5. Configuración del Proyecto en Django

Abre el archivo `settings.py` ubicado en la ruta:

```
bancoSangre/settings.py
```

Configura la base de datos de la siguiente manera:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'bancodb',
        'USER': 'postgres',
        'PASSWORD': '689447',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 6. Aplicar Migraciones y Crear Roles por Defecto

### Crear y aplicar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### Crear los roles predeterminados

Ejecuta el **shell de Django**:

```bash
python manage.py shell
```

Luego, dentro del shell interactivo de Python, escribe:

```python
from rol.models import Rol
Rol.objects.get_or_create(nombre="Administrador")
Rol.objects.get_or_create(nombre="Donador")
exit()
```

---

## 7. Ejecutar el Proyecto

Ejecuta el siguiente comando para iniciar el servidor de desarrollo de Django:

```bash
python manage.py runserver
```

Ejemplo en Windows PowerShell:

```powershell
(venv) PS C:\Users\brian\OneDrive\Documentos\proyectos\GDP\BancoSangre\bancoSangre> python manage.py runserver
```

Esto iniciará el servidor en `http://127.0.0.1:8000/`.

---

## 8. Pruebas Finales

Para verificar que todo esté funcionando correctamente, puedes acceder a la API de usuarios si está configurada, probando la siguiente URL en tu navegador o en Postman:

```
http://127.0.0.1:8000/api/usuarios/
```

Si todo está bien, deberías ver los usuarios junto con su rol asignado.

---

## 9. Comandos útiles

### Salir del shell de Django

Si estás dentro del `python manage.py shell`, puedes salir con:

```python
exit()
```
O presionando `Ctrl + D` en Linux/Mac o `Ctrl + Z` y luego `Enter` en Windows.

---

Este manual te guiará en la instalación y configuración del proyecto **BancoSangre** en cualquier equipo desde cero. 🚀

