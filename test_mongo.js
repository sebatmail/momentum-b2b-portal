const mongoose = require('mongoose');
const uri = 'mongodb+srv://usuario_prueba:Prueba1234@cluster0.73dgb0w.mongodb.net/AP_N3_C1?appName=Cluster0';

console.log("Intentando conectar a MongoDB Atlas...");

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("¡CONEXIÓN EXITOSA! El puerto no está bloqueado.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("¡ERROR DE CONEXIÓN!");
        console.error(err.message);
        process.exit(1);
    });
