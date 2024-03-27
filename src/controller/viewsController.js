const ProductService = require('../service/productService.js');
const CartService = require('../service/cartService.js');
const prodService = new ProductService();
const cartService = new CartService();

class ViewsController {


    landing(req, res) {

        if (req.session.login) {
            return res.redirect("/products");
        }
        res.render("login", { req: req });
    }



    register(req, res) {
        res.render("register");
    }



    login(req, res) {
        if (req.session.login) {
            return res.redirect("/products");
        }

        res.render("login");
    }



    async getProducts(req, res) {

        try {

            if (!req.session.login) {
                return res.redirect("/login");
            }

            const { page = 1, limit = 3 } = req.query;

            const prods = await prodService.getProducts({
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



    profile(req, res) {
        if (req.session.user) {
            res.render('profile', { user: req.session.user })
        } else {
            res.redirect('/login')
        }
    }



    async getProductById(req, res) {
        try {
            const prodId = req.params.prodId
            // Obtener producto por id
            const product = await prodService.getProductById(prodId)
            // Renderiza vista detalles del producto
            res.render('productDetail', { title: 'Product Detail', product, user: req.session.user })
        } catch (error) {
            console.error('Error al intentar encontrar los detalles', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }



    chat(req, res) {
        try {
            res.render('chat', { title: 'Real Time Chat', user: req.session.user })
        } catch (error) {
            console.error('Error interno del servidor', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await cartService.getCartById(cartId);

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
    }

}

module.exports = ViewsController;