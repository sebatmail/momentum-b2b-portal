# 🚀 Ecosistema de Gestión de Misiones B2B - MomentumSpace

¡Bienvenido al sistema de administración interna basado en el proyecto base de la Evaluación N°3! Esta plataforma ha sido estructurada y rediseñada completamente bajo el concepto y estética corporativa de **MomentumSpace**, convirtiendo el requerimiento evaluativo en un **CRM y gestor de proyectos espaciales/B2B** funcional y altamente estilizado.

---

## 📜 Créditos y Origen del Proyecto

⚠️ **Importante:** Este repositorio es un *fork* / modificación avanzada de un proyecto de código abierto proporcionado para fines académicos. 
- **Código Base y Autoría Original:** [Profesor - GitHub Repo (baileytorch)](https://github.com/baileytorch/no_sql_AP_N3_C1.git)
- **Modificaciones, Rediseño UI/UX, e Implementación de Lógica (Esquemas Mongoose, Relaciones, Aggregations):** Desarrollado por el equipo técnico de **MomentumSpace**.

---

## 🏗️ Infraestructura y Arquitectura del Sistema

Este sistema se fundamenta en el stack tecnológico **MERN** (enfocado principalmente en Node.js, Express y MongoDB), aplicando conceptos intermedios-avanzados de bases de datos NoSQL:

- **Mongoose ORM:** Se definieron y ampliaron los `Schema` para garantizar la integridad referencial y de datos. 
  - **`Usuario`**: Estructurado con validaciones a nivel de base de datos (ej. bloqueos lógicos sobre fechas usando `validate`), y subdocumentos embebidos (`direccionSchema`) para mantener los datos atómicos de localización en un solo lugar y evitar colecciones innecesarias. Se implementó encriptación mediante **bcrypt** para las contraseñas.
  - **`Proyecto`**: Se implementó una relación **1:N** referenciando el `ObjectId` del `Usuario`, representando las Misiones o Servicios B2B que adquiere cada cliente de MomentumSpace.
- **Aggregations NoSQL (`$lookup` & `$unwind`):** En lugar de hacer múltiples llamadas separadas, se orquestaron *pipelines* de agregación robustos en MongoDB nativo para hacer un "JOIN" de las colecciones `proyectos` y `usuarios`, exponiendo de manera eficiente los datos relacionales en la vista de la tabla.
- **CORS y Express JSON:** El servidor está habilitado para gestionar el tráfico de origen cruzado de manera segura y parsear payloads de REST APIs de manera nativa.
- **Frontend Glassmorphism:** Se eliminó el frontend rudimentario y se implementó un diseño en CSS Vanilla inyectado con efectos *blur* e interactividad asíncrona mediante **Fetch API** y **DataTables**.

---

## 📁 Estructura Clave de Carpetas

```text
📦 no_sql_AP_N3_C1-main
 ┣ 📂 backend
 ┃ ┣ 📜 servidor.js          # 🧠 (CORE) Rutas Express, Conexión Mongoose, Schemas, y Lógica de Encriptación
 ┃ ┣ 📜 package.json         # 📦 Dependencias (express, mongoose, bcrypt, cors)
 ┃ ┗ 📂 node_modules         
 ┣ 📂 frontend
 ┃ ┣ 📂 css                  # 🎨 Estilos del proyecto
 ┃ ┃ ┣ 📜 momentum.css       # 🌌 Motor visual principal (Tema Galáctico MomentumSpace)
 ┃ ┃ ┗ ...
 ┃ ┣ 📂 scripts              # ⚙️ Lógica del lado del cliente (DOM, Fetch API, Validaciones)
 ┃ ┃ ┣ 📜 formulario.js      # Validación del frontend y serialización FormData -> JSON
 ┃ ┃ ┣ 📜 proyectos.js       # Consumo del $lookup y llenado de DataTables B2B
 ┃ ┃ ┗ 📜 inicio.js          
 ┃ ┣ 📜 inicio.html          # 👥 Directorio de Usuarios/Tripulación
 ┃ ┣ 📜 formulario.html      # 📝 Registro seguro de Usuarios
 ┃ ┗ 📜 proyectos.html       # 🚀 Panel de Creación y Vista de Misiones (Relación 1:N)
 ┗ 📜 README.md
```

---

## ⚙️ Comandos Importantes Usados en el Desarrollo

Durante la construcción de este sistema, se utilizaron comandos clave tanto de Node.js como de la base de datos MongoDB:

```bash
# 1. Inicialización y dependencias del ecosistema
npm init -y
npm install express mongoose cors bcrypt

# 2. Arranque del servidor de desarrollo
node servidor.js
```

### Consultas de agregación MongoDB relevantes utilizadas (Representación Shell):
```javascript
// 1. La magia detrás del endpoint GET /proyectos (Lista global)
db.proyectos.aggregate([
  {
    $lookup: {
      from: "usuarios",
      localField: "usuario",
      foreignField: "_id",
      as: "datosUsuario"
    }
  },
  { $unwind: "$datosUsuario" }
])
```

```javascript
// 2. Motor del "Mi Dashboard" B2B (GET /proyectos/partner/:usuarioId)
// Demuestra una relación 1:N (Uno a Muchos) aislando datos por usuario.
db.proyectos.aggregate([
  { 
    $match: { usuario: ObjectId("ID_DEL_PARTNER") } 
  },
  {
    $lookup: {
      from: "usuarios",
      localField: "usuario",
      foreignField: "_id",
      as: "datosUsuario"
    }
  },
  { $unwind: "$datosUsuario" }
])
// NOTA PARA EVALUACIÓN: Este endpoint es consumido por dashboard.js 
// para simular una sesión privada. Filtra las misiones/referidos exclusivos 
// de un partner y calcula en tiempo real KPIs como el volumen total de presupuesto.
```

---

## 🛠️ Guía de Instalación Rápida

Sigue estos pasos para desplegar el proyecto en tu entorno local:

1. **Clonar el Repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd no_sql_AP_N3_C1-main
   ```

2. **Preparar el Backend**
   Navega a la carpeta del servidor e instala los paquetes necesarios.
   ```bash
   cd backend
   npm install
   ```

3. **Verificar MongoDB** 🍃
   Asegúrate de tener **MongoDB Compass** o el servicio de MongoDB corriendo localmente en el puerto estándar `27017`. La base de datos `AP_N3_C1` se creará automáticamente en la primera inserción si no existe.

4. **Encender el Servidor** 🔌
   ```bash
   node servidor.js
   ```
   *(Deberías ver en consola: `Corriendo en el puerto 3000` y `Conexión Exitosa!`)*

5. **Lanzar la Interfaz** 🚀
   Abre tu navegador de preferencia y arrastra el archivo `inicio.html` desde la carpeta `/frontend`, o ábrelo mediante un Live Server. ¡Todo listo para lanzar las misiones de MomentumSpace!

---

## 🛡️ Hardening & Seguridad (Protección Anti-Pentesting)

Previo al despliegue en entornos productivos (como **cPanel** o VPS), esta API ha sido blindada contra ataques comunes. Se recomienda *nunca* deshabilitar estas opciones:

1. **Ocultamiento de Secretos (`dotenv`):**
   Las credenciales (`MONGO_URI` y `PORT`) ya no están *hardcodeadas* en el código fuente. Esto permite subir el repositorio a GitHub sin exponer la base de datos de MomentumSpace.
   - **En cPanel:** Deberás crear un archivo `.env` en la raíz de tu proyecto Backend, o configurar las variables de entorno desde la interfaz del hosting:
     ```env
     MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/AP_N3_C1
     PORT=3000
     ```

2. **Mitigación de Vulnerabilidades:**
   - **`helmet`:** Oculta cabeceras de Express y establece políticas estrictas (CSP, HSTS) mitigando Clickjacking y Sniffing.
   - **`express-rate-limit`:** Bloquea direcciones IP que intenten realizar ataques de fuerza bruta (ej. ataques de diccionario con Hydra a tus endpoints) o denegación de servicio (DDoS). Límite actual: 100 peticiones cada 15 min.
   - **`express-mongo-sanitize`:** Sanitiza los *payloads* para impedir inyecciones NoSQL (ej. uso malicioso de operadores como `$gt`, `$ne` en los formularios de login o registro).
   - **`xss-clean`:** Limpia *tags* HTML o Scripts maliciosos que intenten robar cookies de sesión mediante Cross-Site Scripting (XSS).