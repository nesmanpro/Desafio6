const express = require('express');
const router = express.Router();
const CartManager = require('../dao/db/cart-manager-db.js');
const CartModel = require("../dao/models/cart.model.js");
const cartManager = new CartManager();


// Endpoint para crear el carrito
router.post('/', async (req, res) => {

    try {

        const cart = await cartManager.createCart();
        res.json(cart);

    } catch (error) {

        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


// Endpoint para listar los productos de un carrito
router.get('/:cid', async (req, res) => {

    try {
        const cartId = req.params.cid;
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        return res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Endpoint para agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const result = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(result.products);
    } catch (error) {
        res.send('Error al intentar guardar producto en el carrito');
    }
});


// Endpoint para eliminar producto especifico del cart
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteProdFromCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'El producto se ha eliminado del carrito satisfactoriamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//Endpoint para actualizar los productos del carrito: 

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});


//Endpoint para actualizar la cantidad de productos

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProdQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//Endpoint para vaciar el carrito: 

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

module.exports = router;