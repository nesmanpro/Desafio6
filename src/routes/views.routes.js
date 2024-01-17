const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const prodManager = new ProductManager('src/models/products.json');


router.get('/', async (req, res) => {
    try {
        const allProds = await prodManager.getProducts();
        res.render('index', { allProds, title: 'Home' })

    } catch (error) {
        console.error('Error, no se han podido encontrar los productos', error);
        res.status(500).json({ error: 'No se encontraron los productos' });
    }
})
router.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', { title: 'Real Time Products' })
    } catch (error) {
        console.error('Error interno del servidor', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

module.exports = router;