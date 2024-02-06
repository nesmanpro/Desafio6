const express = require('express');
const router = express.Router();
const CartManager = require('../dao/db/cart-manager-db.js');
const cartManager = new CartManager();

// Endpoint para crear el carrito
router.post('/', async (req, res) => {
    const cart = await cartManager.createCart();

    try {
        res.json(cart);
    } catch (error) {
        res.send('Error: No se pudo crear el carrito');

    }
});

// Endpoint para listar los productos de un carrito
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    try {
        res.json(cart);
    } catch (error) {
        res.send('Error al intentar enviar los productos del carrito');
    }
});

// Endpoint para agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const result = await cartManager.addProductToCart(cartId, productId, quantity);
    try {
        res.json(result);
    } catch (error) {
        res.send('Error al intentar guardar producto en el carrito');
    }
});

module.exports = router;