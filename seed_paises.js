const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const uri = "mongodb+srv://usuario_prueba:Prueba1234@cluster0.73dgb0w.mongodb.net/AP_N3_C1?appName=Cluster0";

const paisSchema = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

const Pais = mongoose.model('Pais', paisSchema, 'paises');

const paises = [
    { nombre: 'Chile', iso2: 'CL', iso3: 'CHL', codigoPais: '56', nacionalidad: 'Chilena' },
    { nombre: 'Argentina', iso2: 'AR', iso3: 'ARG', codigoPais: '54', nacionalidad: 'Argentina' },
    { nombre: 'Perú', iso2: 'PE', iso3: 'PER', codigoPais: '51', nacionalidad: 'Peruana' },
    { nombre: 'Colombia', iso2: 'CO', iso3: 'COL', codigoPais: '57', nacionalidad: 'Colombiana' },
    { nombre: 'México', iso2: 'MX', iso3: 'MEX', codigoPais: '52', nacionalidad: 'Mexicana' },
    { nombre: 'España', iso2: 'ES', iso3: 'ESP', codigoPais: '34', nacionalidad: 'Española' }
];

async function seed() {
    try {
        await mongoose.connect(uri);
        console.log("Conectado a Atlas.");
        await Pais.deleteMany({});
        await Pais.insertMany(paises);
        console.log("Países insertados correctamente.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
