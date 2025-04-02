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

Después de clonar el repositorio y antes de trabajar en el proyecto, se debe crear un entorno virtual local que contendrá las dependencias del proyecto.

### Crear un entorno virtual

En la raíz del repositorio clonado, crea un entorno virtual:

```bash
python -m venv venv
```

Luego, activa el entorno virtual:

```bash
venv\Scripts\activate
```

> El entorno virtual ahora está activo y verás un prefijo `(venv)` en tu terminal.

### Instalar las dependencias

Asegúrate de tener el archivo `requirements.txt` en la raíz del repositorio. Luego, instala las dependencias:

```bash
pip install -r requirements.txt
```

---

## 3. Configuración de la Base de Datos `bancodb` en PostgreSQL para Windows

### Abrir la Consola de PostgreSQL

Se realizará la configuración inicial de PostgreSQL. Sigue estos pasos:

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

## 4. Configuración del Proyecto en Django

Una vez creada la base de datos, verifica la configuración en el entorno de Django. Abre el archivo `settings.py` ubicado en la ruta:

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



Ahora para montar el proyecto deberas ejecutar el comando `python manage.py runserver`, sera como en el ejemplo siguiente: 
```python
(venv) PS C:\Users\brian\OneDrive\Documentos\proyectos\GDP\BancoSangre\bancoSangre> python manage.py runserver
```
![image](https://github.com/user-attachments/assets/3f0ebc98-1108-490a-8d23-2395598d95d6)


