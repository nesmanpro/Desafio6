

// ***** Testeo de uso: *****


// importar product manager y crear instancia ProductManager.

const ProductManager = require('./product-manager.js')

const manager = new ProductManager('./db/products.json');

// declaramos puerto y llamamos express

const puerto = 8080;

const express = require('express');

// creamos app

const app = express();

// Creamos ruta

app.get('/', (req, res) => {
    res.send('Mi primera chamba pero con Express!')
})

// Creamos puerto

app.listen(puerto, () => {
    console.log(`Escuchando en el puerto http://localhost:${puerto}`);
});

app.get('/contact', (req, res) => {
    res.send(`<h1> Bienvenido a la pagina de contacto </h1>`)
})