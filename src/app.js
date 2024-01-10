// ***** Testeo de uso: *****

// importar product manager, declaramos puerto, llamamos express y creamos app

const express = require('express');
const app = express();
const puerto = 8080;
const productsRouter = require('./routes/products.router')

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas

app.use('/api/products', productsRouter);





// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
}); 