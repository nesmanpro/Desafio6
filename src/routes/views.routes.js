const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/db/product-manager-db.js');
const CartManager = require('../dao/db/cart-manager-db.js');
const prodManager = new ProductManager();
const cartManager = new CartManager();
const productModel = require("../dao/models/products.model.js")


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


// Ruta para la vista product.handlebars
router.get('/products', async (req, res) => {
    const page = req.query.page || 1;
    const limit = 5;

    try {
        const prodList = await productModel.paginate({}, { limit, page })

        const prodsResult = prodList.docs.map(product => {
            const { id, ...rest } = product.toObject()
            return rest
        });

        res.render('products', {
            title: 'Products',
            products: prodsResult,
            hasPrevPage: prodList.hasPrevPage,
            hasNextPage: prodList.hasNextPage,
            prevPage: prodList.prevPage,
            nextPage: prodList.nextPage,
            currentPage: prodList.page,
            totalPages: prodList.totalPages
        });
    } catch (error) {
        console.log("Hubo algun error en la paginación ", error)
        res.status(500).send("Error fatal en el server")
    }
})

// Ruta para la vista productDetail.handlebars
router.get('/products/:prodId', async (req, res) => {
    try {
        const prodId = req.params.prodId
        // Obtener producto por id
        const product = await prodManager.getProductById(prodId)
        // Renderiza vista detalles del producto
        res.render('productDetail', { title: 'Product Detail', product })
    } catch (error) {
        console.error('Error al intentar encontrar los detalles', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Ruta para la vista cart.handlebars
router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid
    try {
        const cart = await cartManager.getCartById(cartId)
        if (!cart) {
            console.error(`El carrito con id ${cartId} no existe`)
            return cart
        }

        //Renderiza carrito con sus productos asociados
        res.render('cart', { cartId, products: cart.product, title: 'Cart' })
    } catch (error) {
        console.error("No se ha encontrado el carrito", error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


module.exports = router;