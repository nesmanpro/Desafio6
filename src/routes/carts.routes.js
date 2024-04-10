const express = require('express');
const router = express.Router();

// Service / controler
const CartController = require('../controller/cartController.js');
const cartController = new CartController();

// Endpoint para crear el carrito
router.post('/', cartController.createCart);
// Endpoint para listar los productos de un carrito
router.get('/:cid', cartController.getCart);
// Endpoint para agregar producto al carrito
router.post('/:cid/products/:pid', cartController.addProductToCart);
// Endpoint para eliminar producto especifico del cart
router.delete('/:cid/product/:pid', cartController.deleteProdFromCart);
//Endpoint para actualizar los productos del carrito: 
router.put('/:cid', cartController.updateCart);
//Endpoint para actualizar la cantidad de productos
router.put('/:cid/product/:pid', cartController.updateProdQuantity);
//Endpoint para vaciar el carrito: 
router.delete('/:cid', cartController.emptyCart);


module.exports = router;