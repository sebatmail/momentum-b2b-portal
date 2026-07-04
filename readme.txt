========================================================================
   GUÍA DE DESPLIEGUE, SOLUCIÓN DE PROBLEMAS Y ARQUITECTURA DE RED
========================================================================
Proyecto: Ecosistema de Gestión de Misiones B2B - MomentumSpace
Plataforma: Node.js + Express + MongoDB Atlas + Render.com
========================================================================

Este documento detalla los problemas de infraestructura encontrados durante el despliegue del proyecto, los motivos técnicos detrás de ellos, cómo se solucionaron y el paso a paso de la migración definitiva a la nube de Render.com.

Esta información es clave para comprender la arquitectura de red y sirve como justificación técnica para la presentación ante el docente.

------------------------------------------------------------------------
1. EL PROBLEMA ORIGINAL: BLOQUEO DE FIREWALL EN CPANEL
------------------------------------------------------------------------
Durante los intentos iniciales de desplegar la aplicación en un plan de hosting compartido con cPanel, las rutas del backend de Node.js (como '/paises' y el registro de usuarios) arrojaban un Error 500 (Internal Server Error) o caían en "timeout".

* ¿Por qué sucedió?
  Los planes de hosting compartido (cPanel) están diseñados para albergar sitios web tradicionales (PHP/MySQL) donde la base de datos vive dentro del mismo servidor (localhost). Por motivos estrictos de seguridad, los administradores del hosting bloquean todos los puertos de comunicación saliente no estándar.
  MongoDB Atlas requiere que la aplicación Node.js se comunique hacia el exterior en el puerto 27017 (puerto TCP estándar de MongoDB). Al estar este puerto cerrado en el firewall del hosting (CSF/iptables), la aplicación Node.js se quedaba esperando respuesta indefinidamente hasta colapsar la conexión.

* Solicitud de Soporte:
  Para resolver esto de forma tradicional en cPanel, se requiere abrir un ticket de soporte técnico solicitando a los administradores del hosting habilitar el puerto saliente TCP 27017 en las políticas del firewall del servidor compartido.

------------------------------------------------------------------------
2. LA MIGRACIÓN A RENDER.COM (NUESTRA SOLUCIÓN EN LA NUBE)
------------------------------------------------------------------------
Para no depender de los tiempos de espera del hosting compartido y asegurar el funcionamiento inmediato del proyecto con MongoDB Atlas, migramos la infraestructura a Render.com.

* ¿Qué es Render y para qué sirve?
  Render es una plataforma moderna de alojamiento en la nube (PaaS o Platform as a Service) para aplicaciones modernas de Node.js, Python, bases de datos, etc. A diferencia de cPanel, Render está optimizado para conectarse nativamente con bases de datos en la nube y mantiene abiertos los puertos de salida necesarios (incluyendo el 27017) sin restricciones de firewall.

* Pasos del despliegue en Render:
  1. Conexión de GitHub: Sincronizamos el repositorio de GitHub 'momentum-b2b-portal' a una cuenta de Render.
  2. Creación del Web Service: Se seleccionó un servicio web (Web Service) gratuito que aloja tanto la API de Express (backend) como los archivos estáticos HTML/CSS/JS (frontend).
  3. Comando de Construcción (Build): Configurado con "npm install" para descargar de forma limpia todas las dependencias del archivo package.json.
  4. Comando de Inicio (Start): Configurado con "node backend/servidor.js" indicando la ruta exacta de ejecución de nuestro servidor de Express.

------------------------------------------------------------------------
3. DIAGNÓSTICO Y SOLUCIÓN DEL ERROR DNS SRV EN ENTORNO LOCAL
------------------------------------------------------------------------
Al intentar inyectar los datos iniciales de los países usando el script local 'seed_paises.js', el sistema arrojaba el error: "Error: querySrv ECONNREFUSED".

* Diagnóstico:
  La cadena de conexión de MongoDB Atlas usa el prefijo "mongodb+srv://", el cual requiere que la red del computador resuelva registros de tipo SRV. Algunos proveedores de internet domésticos o configuraciones locales de enrutadores tienen servidores DNS que rechazan o no saben resolver estas consultas especiales de base de datos.

* Solución técnica implementada:
  Se editó el archivo 'seed_paises.js' para forzar a la aplicación a usar directamente los servidores de DNS públicos de Google (8.8.8.8 y 8.8.4.4) utilizando el módulo nativo de DNS de Node.js:
  
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);

  Esto permitió que el script enlazara exitosamente hacia Atlas, inyectando la colección 'paises' de manera remota e inmediata desde el computador, sin necesidad de interactuar con la consola de Render.

------------------------------------------------------------------------
4. CREDENCIALES DE PRUEBA Y PRÁCTICA PROFESIONAL
------------------------------------------------------------------------
Para facilitar la evaluación y revisión del profesor, el código fuente en GitHub contiene configurada una conexión de prueba con las siguientes credenciales en el clúster de Atlas:
* Usuario: usuario_prueba
* Contraseña: Prueba1234
* Privilegios: Lectura y escritura en cualquier base de datos (Read and write to any database).

* Nota sobre seguridad:
  Para un entorno de producción real fuera del ámbito universitario, la cadena de conexión nunca debe estar visible en el código de GitHub. En su lugar, se debe utilizar la variable de entorno 'MONGO_URI' configurándola directamente en el panel de Render en la sección de "Settings -> Environment Variables", manteniendo la seguridad del clúster de datos.

------------------------------------------------------------------------
5. VERIFICACIÓN DEL SISTEMA
------------------------------------------------------------------------
* Url de la Web en Producción: https://momentum-b2b-portal.onrender.com/formulario.html
* Url del API de Países: https://momentum-b2b-portal.onrender.com/paises

El sistema ahora se comunica exitosamente:
[Navegador (Frontend)] <--(HTTPS)--> [Render (Backend Express)] <--(Puerto 27017)--> [MongoDB Atlas Cloud]
========================================================================
