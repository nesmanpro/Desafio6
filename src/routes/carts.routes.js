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


router.post('/', async (req, res) => {
    try {
        const resp = await CartManager.newCart();
        res.json(resp)
    } catch (error) {
        res.send('Lo sentimos, error al crear el carrito')
    }
})


router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.id);
    try {
        const resp = await cartsManager.getCartProds(cid);
        res.json(resp);
    } catch (error) {
        res.send('Error al intentar enviar productos al  carrito')
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = parseInt(req.params);
    try {
        await cartsManager.addProdToCart(cid, pid);
        res.send('Producto agregado exitosamente')
    } catch (error) {
        res.send('Error al intentar guardar producto en el carrito')

    }
})

module.exports = router;