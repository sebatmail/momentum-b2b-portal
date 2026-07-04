// Importamos las librerías instaladas
require('dotenv').config(); // Cargar variables de entorno (Ocultamiento de credenciales)
const express = require('express'); // Express permite generar la aplicación backend
const cors = require('cors'); // Cors permite que el servidor reciba solicitudes externas
const mongoose = require('mongoose'); // ORM que permite trabajar con objetos y DBs
const bcrypt = require('bcryptjs'); // Usar bcryptjs para evitar errores de compilación C++ en cPanel

// Hardening & Security Middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Iniciar la aplicación express
const aplicacion = express();
const puerto = process.env.PORT || 3000;

// Instanciar las clases necesarias en nuestra aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Importar módulo de rutas y configurar servidor de estáticos
const path = require('path');
aplicacion.use(express.static(path.join(__dirname, '../')));

// Inyectar Security Middlewares
aplicacion.use(helmet());
aplicacion.use(mongoSanitize());
aplicacion.use(xss());

// Prevenir ataques de fuerza bruta limitando las peticiones
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita cada IP a 100 peticiones por windowMs
    message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo en 15 minutos.'
});
aplicacion.use(limiter);

// Crear la conexión a DB
const uri = process.env.MONGO_URI || 'mongodb+srv://usuario_prueba:Prueba1234@cluster0.73dgb0w.mongodb.net/AP_N3_C1?appName=Cluster0';
mongoose.connect(uri)
    .then(() => console.log('Conexión Exitosa a la Base de Datos!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse por el siguiente error: ', excepcion));

aplicacion.listen(puerto, () => console.log(`Corriendo seguro en el puerto ${puerto}`));

const comuna = new mongoose.Schema({
    codigo: String,
    nombre: String,
    region: String
});

const Comuna = mongoose.model('Comuna', comuna, 'comunas');

const direccionSchema = new mongoose.Schema({
    comuna: { type: String, required: true },
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    departamento: { type: String }
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    rut: { type: String, required: true },
    telefono: { type: String },
    contrasena: { type: String, required: true },
    fechaNacimiento: { 
        type: Date,
        validate: {
            validator: function(v) {
                return v < new Date();
            },
            message: 'La fecha de nacimiento debe ser anterior a la fecha actual.'
        }
    },
    genero: { type: String, enum: ['M', 'F', 'O'] },
    nacionalidad: { type: String, required: true },
    direccion: { type: direccionSchema, required: true },
    fechaRegistro: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

const proyectoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    estado: { type: String, default: 'Activo' },
    presupuesto: { type: Number },
    prioridad: { type: String, enum: ['Baja', 'Media', 'Alta'], default: 'Media' },
    categoria: { type: String },
    avance: { type: Number, min: 0, max: 100, default: 0 }
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema, 'proyectos');

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

const Pais = mongoose.model('Pais', pais, 'paises');

aplicacion.post('/guardarUsuario', async (request, response) => {
    try {
        const { nombre, correo, rut, telefono, contrasena, fechaNacimiento, genero, nacionalidad, direccion } = request.body;
        const saltRounds = 10;
        const contrasenaEncriptada = await bcrypt.hash(contrasena, saltRounds);
        const jsonDireccion = JSON.parse(direccion);
        const nuevoUsuario = new Usuario({ nombre, correo, rut, telefono, contrasena: contrasenaEncriptada, fechaNacimiento, genero, nacionalidad, direccion: jsonDireccion });
        await nuevoUsuario.save();
        response.status(200).json({ mensaje: 'Datos almacenados correctamente.' });
    } catch (excepcion) {
        response.status(500).json({ mensaje: 'No se han podido almacenar los datos: ', error: excepcion.message });
    }
});

aplicacion.post('/guardarProyecto', async (request, response) => {
    try {
        const { usuarioId, nombre, descripcion, fechaInicio, fechaFin, estado, presupuesto, prioridad, categoria, avance } = request.body;
        const nuevoProyecto = new Proyecto({
            usuario: usuarioId, nombre, descripcion, fechaInicio, fechaFin, estado, presupuesto, prioridad, categoria, avance
        });
        await nuevoProyecto.save();
        response.status(200).json({ mensaje: 'Proyecto guardado correctamente.' });
    } catch (excepcion) {
        response.status(500).json({ mensaje: 'No se pudo guardar el proyecto: ', error: excepcion.message });
    }
});

aplicacion.get('/usuarios', async (request, response) => {
    try {
        const usuarios = await Usuario.aggregate([{ 
            $lookup:{
                from:'paises',
                localField:'nacionalidad',
                foreignField:'iso2',
                as: 'paisOrigen'
            }
        }]);
        if (!usuarios || usuarios.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron usuarios registrados.' });
        }
        response.status(200).json(usuarios);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los datos: ', error });
    }
});

aplicacion.get('/proyectos', async (request, response) => {
    try {
        const proyectos = await Proyecto.aggregate([
            {
                $lookup: {
                    from: 'usuarios', 
                    localField: 'usuario', 
                    foreignField: '_id',
                    as: 'datosUsuario'
                }
            },
            {
                $unwind: '$datosUsuario' 
            },
            {
                $project: {
                    _id: 1, nombre: 1, descripcion: 1, fechaInicio: 1, fechaFin: 1, estado: 1, presupuesto: 1, prioridad: 1, categoria: 1, avance: 1,
                    usuario_nombre: '$datosUsuario.nombre',
                    usuario_rut: '$datosUsuario.rut',
                    usuario_correo: '$datosUsuario.correo'
                }
            }
        ]);
        if (!proyectos || proyectos.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron proyectos.' });
        }
        response.status(200).json(proyectos);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los proyectos.', error: error.message });
    }
});

aplicacion.get('/proyectos/partner/:usuarioId', async (request, response) => {
    try {
        const { usuarioId } = request.params;
        const proyectos = await Proyecto.aggregate([
            {
                $match: { usuario: new mongoose.Types.ObjectId(usuarioId) }
            },
            {
                $lookup: {
                    from: 'usuarios', 
                    localField: 'usuario', 
                    foreignField: '_id',
                    as: 'datosUsuario'
                }
            },
            {
                $unwind: '$datosUsuario' 
            },
            {
                $project: {
                    _id: 1, nombre: 1, descripcion: 1, fechaInicio: 1, fechaFin: 1, estado: 1, presupuesto: 1, prioridad: 1, categoria: 1, avance: 1,
                    usuario_nombre: '$datosUsuario.nombre',
                    usuario_rut: '$datosUsuario.rut',
                    usuario_correo: '$datosUsuario.correo'
                }
            }
        ]);
        response.status(200).json(proyectos);
    } catch (error) {
        response.status(500).json({ mensaje: 'Error al obtener el dashboard del partner.', error: error.message });
    }
});

aplicacion.get('/paises', async (request, response) => {
    try {
        const paises = await Pais.find().exec();
        if (!paises || paises.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron países registrados.' });
        }
        response.status(200).json(paises);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los datos: ', error });
    }
});

aplicacion.get('/comunas', async (request, response) => {
    try {
        const comunas = await Comuna.find().exec();
        if (!comunas || comunas.length === 0) {
            return response.status(404).json({ mensaje: 'No se encontraron comunas registradas.' });
        }
        response.status(200).json(comunas);
    } catch (error) {
        response.status(500).json({ mensaje: 'No ha sido posible obtener los datos: ', error });
    }
});
