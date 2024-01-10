
// Declaramos puerto, llamamos express y creamos app y fs

const express = require('express');
const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Creamos las rutas para prods y carts

const cartsRouter = require('./routes/carts.router');
const productsRouter = require('./routes/products.router');

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
