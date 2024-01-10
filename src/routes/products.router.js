const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/ProductManager');
const prodManager = new ProductManager('src/models/products.json');



// Endpoint para obtener productos y filtrarlo con query param limit
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const allProds = await prodManager.readFile();


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
router.get('/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        const prod = await prodManager.getProductsById(pid);
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

module.exports = router;