const express = require('express');
const router = express.Router();

const ProductManager = require('../dao/db/product-manager-db.js');
const prodManager = new ProductManager();



// Endpoint para obtener productos y filtrarlo con query param limit
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const allProds = await prodManager.getProducts();


        if (!isNaN(limit)) {
            const limitedProducts = allProds.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json(allProds);
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Endpoint para obtener productos por id
router.get('/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        const prod = await prodManager.getProductById(pid);
        const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
        if (prod) {
            res.json(prod)
        } else {
            res.json({ error })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

// Endpoint para agregar producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;

        const response = await prodManager.addProduct({ title, description, code, price, stock, category, thumbnails, status });
        res.json(response)
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar agregar un producto`)
    }
});

// Endpoint para editar o sobreescribir producto
router.put('/:pid', async (req, res) => {

    let pid = req.params.pid;
    const prod = await prodManager.getProductById(pid);

    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;
        const response = await prodManager.updateProduct(pid, { title, description, code, price, stock, category, thumbnails, status });
        if (prod !== null) {
            res.send('Producto actualizado con exito!');
        } else {
            res.send(`Parece que el producto con id ${pid} no existe.`)
        }
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar editar el producto con id ${pid}`)
    }
});


// Endpoint para eliminar producto
router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;
    console.log('Valor de pid:', pid);
    try {
        await prodManager.deleteProduct(pid)
        res.send(`Producto ${pid} eliminado correctamente`)
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar eliminar el producto con id ${pid}`)
    }
})

module.exports = router;