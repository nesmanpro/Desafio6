const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nesmanpro:g4ECFS0wHimlGF18@cluster0.we6hggz.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(() => console.log('Enhorabuena!! Conexion establecida!'))
    .catch(() => console.log('Lo sentimos! Ha habido algun error con el servidor mongoDB'))
