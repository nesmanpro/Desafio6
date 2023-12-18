// ***** Testeo de uso: *****

// importar product manager, declaramos puerto, llamamos express y creamos app

const express = require('express');
const ProductManager = require('./product-manager');
const app = express();
const puerto = 8080;

// crear instancia ProductManager.

const manager = new ProductManager('./db/products.json');


// Creamos ruta
app.get('/', (req, res) => {
    res.send('Mi primera chamba pero con Express!')
})


// Endpoint para obtener productos y filtrarlo con query param limit
app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const allProds = await manager.readFile();


        if (!isNaN(limit)) {
            const limitedProducts = allProds.slice(0, limit);
            res.send(limitedProducts);
        } else {
            res.send(allProds);
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Endpoint para obtener productos por id
app.get('/products/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        const prod = await manager.getProductsById(pid);
        const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
        if (prod) {
            res.send(prod)
        } else {
            res.send({ error })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});



// Iniciar el servidor
app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});