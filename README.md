# 📌 Configuración del Proyecto Django con PostgreSQL

Este documento describe los pasos necesarios para configurar y ejecutar un proyecto Django con PostgreSQL en una nueva computadora.

---

## 🚀 Instalación de Python y Creación del Entorno Virtual

1. **Verificar la versión de Python**  
   Asegúrate de que tienes la misma versión con la cual se trabaja en el proyecto (ejemplo: `3.12.9`):  
   ```bash
   python --version
   ```

2. **Crear el entorno virtual**  
   ```bash
   python -m venv venv
   ```

3. **Activar el entorno virtual**  
   - En **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - En **Mac/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Instalar las dependencias del proyecto**  
   ```bash
   pip install -r requirements.txt
   ```

---

## 🛠️ Instalación y Configuración de PostgreSQL

1. **Descargar e instalar PostgreSQL**  
   Descárgalo desde: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

2. **Configuración básica:**  
   - **Usuario:** `postgres` (por defecto)  
   - **Contraseña:** Elegida por el usuario (se deberá actualizar dentro del proyecto)  
   - **Puerto:** `5432` (por defecto)  

---

## 📂 Migración de la Base de Datos desde Django a PostgreSQL

1. **Generar migraciones**  
   ```bash
   python manage.py makemigrations
   ```

2. **Aplicar las migraciones a PostgreSQL**  
   ```bash
   python manage.py migrate
   ```

---

## 🗄️ Verificación de la Base de Datos en SQL Shell de PostgreSQL

1. **Listar las bases de datos disponibles**  
   ```sql
   \list
   ```

2. **Ubicar la base de datos `bancodb` y acceder a ella**  
   ```sql
   \c bancodb
   ```

3. **Listar las tablas y verificar la existencia de `donadores-donadores`**  
   ```sql
   \dt
   ```

Si la tabla `donadores-donadores` aparece en la lista, significa que la migración fue exitosa. ✅

---

