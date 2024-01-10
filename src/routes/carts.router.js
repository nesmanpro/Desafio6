const express = require('express');
const router = express.Router();

const CartManager = require('../controllers/ProductManager');
const cartsManager = new CartManager('src/models/carts.json');

// Rutas

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const allCarts = await cartsManager.readFile();


        if (!isNaN(limit)) {
            const limitedCarts = allCarts.slice(0, limit);
            res.send(limitedCarts);
        } else {
            res.send(allCarts);
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Endpoint para obtener productos por id
router.get('/:pid', async (req, res) => {
    try {
        let cid = req.params.pid;
        const cart = await cartsManager.getProductsById(cid);
        const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
        if (cart) {
            res.send(cart)
        } else {
            res.send({ error })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

module.exports = router;