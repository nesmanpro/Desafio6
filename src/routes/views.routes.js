const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/db/product-manager-db.js');
const prodManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const allProds = await prodManager.getProducts();
        res.render('home', { allProds, title: 'Home' })

    } catch (error) {
        console.error('Error, no se han podido encontrar los productos', error);
        res.status(500).json({ error: 'No se encontraron los productos' });
    }
})


router.get('/chat', (req, res) => {
    try {
        res.render('chat', { title: 'Real Time Chat' })
    } catch (error) {
        console.error('Error interno del servidor', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})

module.exports = router;