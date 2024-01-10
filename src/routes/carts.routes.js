const express = require('express');
const router = express.Router();

const CartManager = require('../controllers/CartManager');
const cartsManager = new CartManager('src/models/carts.json');

// Rutas

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const allCarts = await cartsManager.readFile();


        if (!isNaN(limit)) {
            const limitedCarts = allCarts.slice(0, limit);
            res.json(limitedCarts);
        } else {
            res.json(allCarts);
        }

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Endpoint para obtener carrito por id
router.get('/:pid', async (req, res) => {
    try {
        let cid = req.params.pid;
        const cart = await cartsManager.getCartsById(cid);
        const error = { Error: 'Lo sentimos! no se ha encontrado el carrito que andas buscando.' };
        if (cart) {
            res.json(cart)
        } else {
            res.json({ error })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

module.exports = router;