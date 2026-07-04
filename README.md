# 🚀 Ecosistema de Gestión de Misiones B2B - MomentumSpace

¡Bienvenido al sistema de administración interna basado en la **Evaluación N°3 de Búsqueda Avanzada con MongoDB**! Esta plataforma ha sido estructurada, refinada y rediseñada completamente bajo el concepto y estética corporativa de **MomentumSpace**, convirtiendo el requerimiento evaluativo en un **CRM y gestor de proyectos espaciales/B2B** funcional, moderno y altamente estilizado.

---

## 📜 Créditos y Origen del Proyecto

⚠️ **Importante:** Este repositorio es una modificación avanzada de un proyecto de código abierto proporcionado para fines académicos. 
- **Código Base y Autoría Original:** [Profesor - GitHub Repo (baileytorch)](https://github.com/baileytorch/no_sql_AP_N3_C1.git)
- **Modificaciones, Rediseño UI/UX, e Implementación de Lógica (Esquemas Mongoose, Relaciones, Aggregations, Deploy de Red):** Desarrollado por Sebastián para su portafolio y uso interno en **MomentumSpace**.

---

## 🏗️ Módulos y Arquitectura del Sistema

El portal cuenta con 4 módulos principales diseñados bajo un estilo "cyber-galáctico" responsivo:

1. **Partners (Directorio) [`index.html`]:**
   * Panel de administración principal que consulta y lista a todos los Partners registrados en el sistema, mostrando sus datos ordenados mediante tablas interactivas de **DataTables 2.0+**.
2. **Registro Partner [`formulario.html`]:**
   * Formulario de incorporación con validación avanzada en tiempo real: verificación algorítmica de RUT chileno con dígito verificador, control estricto de edad (mínimo 18 años, máximo 100 años), y protección de contraseñas mediante encriptación hash con `bcryptjs` en el servidor.
3. **Referidos (Clientes B2B) [`proyectos.html`]:**
   * Formulario y tabla histórica global para la creación de proyectos y derivación de clientes. Este módulo implementa la relación directa Mongoose (`ObjectId`) y es el encargado de consultar las colecciones cruzadas mediante **agregaciones `$lookup` y `$unwind`** para asociar visualmente el nombre y RUT del Partner a cada proyecto.
4. **Mi Dashboard [`dashboard.html`]:**
   * Espacio personal interactivo para los Partners, donde se visualiza el detalle específico e histórico de sus propias operaciones referidas, montos de comisión, estado de proyectos y métricas de avance de misiones.

---

## 📁 Estructura del Proyecto

```text
📦 no_sql_AP_N3_C1-main
 ┣ 📂 assets
 ┃ ┗ 📂 images
 ┃   ┗ 📜 momentum_logo.jpg  # Logo corporativo comprimido para rendimiento
 ┣ 📂 backend
 ┃ ┣ 📜 servidor.js          # 🧠 (CORE) Rutas Express, Conexión Mongoose, Schemas y Lógica de Encriptación
 ┃ ┣ 📜 package.json         # 📦 Dependencias (express, mongoose, bcryptjs, cors, helmet, etc.)
 ┃ ┗ 📜 .env                 # Variables de entorno (Ignorado en Git - Configurado localmente)
 ┣ 📂 css
 ┃ ┣ 📜 brite.css            # Hoja de estilos base
 ┃ ┣ 📜 estilos.css          # Estilos adicionales
 ┃ ┗ 📜 momentum.css         # 🌌 Motor visual principal (Tema Galáctico MomentumSpace)
 ┣ 📂 scripts
 ┃ ┣ 📜 comunas_chile.js     # Datos estructurados de comunas locales
 ┃ ┣ 📜 dashboard.js         # Lógica interactiva del panel de operaciones
 ┃ ┣ 📜 formulario.js        # Validación del frontend y serialización FormData -> JSON
 ┃ ┣ 📜 inicio.js            # Inicialización de directorio de tripulación
 ┃ ┣ 📜 jquery v4.0.0.js     # Dependencia jQuery local
 ┃ ┣ 📜 paises.js            # Datos estructurados de países
 ┃ ┗ 📜 proyectos.js         # Consumo de $lookup y cargado de DataTables B2B
 ┣ 📜 index.html             # 👥 Directorio de Usuarios/Tripulación
 ┣ 📜 formulario.html         # 📝 Registro seguro de Usuarios
 ┣ 📜 proyectos.html          # 🚀 Panel de Creación y Vista de Misiones (Relación 1:N)
 ┣ 📜 dashboard.html          # 📊 Visualización de métricas de operaciones
 ┣ 📜 README.md              # Documentación técnica general
 ┣ 📜 readme.txt             # Guía detallada de infraestructura y redes
 ┗ 📜 seed_paises.js         # Script de sembrado inicial de países
```

---

## 🛡️ Hardening, Seguridad y Redes

### 1. Desafío de Redes: cPanel vs. Render Cloud (Firewall)
* **El Problema:** Al desplegar en cPanel (`partners.momentumspace.cl`), las peticiones a MongoDB Atlas caían en *timeout* debido a que el firewall del hosting compartido bloquea las conexiones salientes por el **puerto TCP 27017** (puerto por defecto de MongoDB).
* **La Solución:** Implementamos un plan de contingencia usando **Render Cloud** para alojar el Web Service del Backend en vivo. Render permite tráfico libre en el puerto 27017, logrando establecer la comunicación exitosa hacia la nube de MongoDB Atlas.

### 2. Solución DNS SRV Local
* Durante las pruebas locales, la cadena de conexión con prefijo `mongodb+srv://` fallaba debido a que las DNS del ISP local no resolvían registros de tipo SRV. Se solucionó en el script de sembrado `seed_paises.js` forzando de manera programática el uso de los servidores de DNS públicos de Google (`8.8.8.8`).

### 3. Middleware de Seguridad
* **`helmet`:** Cabeceras HTTP seguras para mitigar Clickjacking y Sniffing.
* **`express-rate-limit`:** Protección contra fuerza bruta limitando peticiones por IP.
* **`express-mongo-sanitize`:** Prevención de inyección NoSQL.
* **`xss-clean`:** Sanitización contra Cross-Site Scripting (XSS).

---

## 🗄️ Credenciales de Prueba (Evaluación)

Para efectos de revisión por parte del docente, la aplicación está conectada de forma predeterminada a un clúster de prueba con las siguientes credenciales en Atlas:
* **Base de Datos:** `AP_N3_C1`
* **Usuario:** `usuario_prueba`
* **Contraseña:** `Prueba1234`
* **MongoDB URI:** `mongodb+srv://usuario_prueba:Prueba1234@cluster0.73dgb0w.mongodb.net/AP_N3_C1?appName=Cluster0`

*(Nota: En entornos productivos reales de MomentumSpace, estas claves se cargan en variables de entorno ocultas desde el panel de Render).*

---

## 🔌 Guía de Instalación Local

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/sebatmail/momentum-b2b-portal.git
   cd momentum-b2b-portal
   ```

2. **Preparar el Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Iniciar el Servidor**
   ```bash
   node servidor.js
   ```

4. **Acceder a la Aplicación**
   Abre `index.html` en tu navegador (o mediante Live Server) desde la raíz del proyecto. El frontend se comunicará automáticamente con la API en el puerto `3000`.