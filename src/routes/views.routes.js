const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/db/product-manager-db.js');
const CartManager = require('../dao/db/cart-manager-db.js');
const prodManager = new ProductManager();
const cartManager = new CartManager();


// Endpoint para el formulario de registro
router.get("/", (req, res) => {

    if (req.session.login) {
        return res.redirect("/products");
    }
    res.render("login", { req: req });
});

router.get('/register', (req, res) => {
    res.render("register");
})

// Endpoint para el formulario de login
router.get("/login", (req, res) => {
    if (req.session.login) {
        return res.redirect("/products");
    }

    res.render("login");
});


// Endpoint para la vista de productos
router.get('/products',
    async (req, res) => {

        try {

            if (!req.session.login) {
                return res.redirect("/login");
            }

            const { page = 1, limit = 3 } = req.query;

            const prods = await prodManager.getProducts({
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const newArray = prods.docs.map(prod => {
                const { id, ...rest } = prod.toObject();
                return rest;
            });

            res.render("products", {
                user: req.session.user,
                products: newArray,
                title: 'Products',
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
    }
);

// Endpoint para vista de perfil

router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user })
    } else {
        res.redirect('/login')
    }
})




// Endpoint para la vista productDetail.handlebars
router.get('/products/:prodId', async (req, res) => {
    try {
        const prodId = req.params.prodId
        // Obtener producto por id
        const product = await prodManager.getProductById(prodId)
        // Renderiza vista detalles del producto
        res.render('productDetail', { title: 'Product Detail', product, user: req.session.user })
    } catch (error) {
        console.error('Error al intentar encontrar los detalles', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})


router.get('/chat', (req, res) => {
    try {
        res.render('chat', { title: 'Real Time Chat', user: req.session.user })
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