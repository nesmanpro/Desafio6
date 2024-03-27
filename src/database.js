const mongoose = require('mongoose');

// importacion dotenv.config
const configObj = require('./config/dotenv.config.js');
const { mongo_url } = configObj;

mongoose.connect(mongo_url)
    .then(() => console.log('Enhorabuena!! Conexion establecida!'))
    .catch(() => console.log('Lo sentimos! Ha habido algun error con el servidor mongoDB'))
