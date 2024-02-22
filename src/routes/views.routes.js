const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/db/product-manager-db.js');
const CartManager = require('../dao/db/cart-manager-db.js');
const prodManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {

    try {

        const { page = 1, limit = 2 } = req.query;

        const prods = await prodManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newArray = prods.docs.map(prod => {
            const { _id, ...rest } = prod.toObject();
            return rest;
        });

        res.render("products", {
            productos: newArray,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            currentPage: prods.page,
            totalPages: prods.totalPages
        });


    } catch (error) {
        console.error('Error, no se han podido encontrar los productos', error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
})

router.get('/products', async (req, res) => {

    try {

        const { page = 1, limit = 2 } = req.query;

        const prods = await prodManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const newArray = prods.docs.map(prod => {
            const { _id, ...rest } = prod.toObject();
            return rest;
        });

        res.render("products", {
            productos: newArray,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            currentPage: prods.page,
            totalPages: prods.totalPages
        });


    } catch (error) {
        console.error('Error, no se han podido encontrar los productos', error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
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

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            console.log(`No existe ese carrito con el id ${cartId} `);
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const prodsInCart = cart.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));


        res.render("carts", { productos: prodsInCart });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;