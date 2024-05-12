const ProductRepository = require('../repositories/productRepository.js');
const CartRepository = require('../repositories/cartRepository.js');
const prodRepository = new ProductRepository();
const cartRepository = new CartRepository();
const { getRole } = require('../utils/userAdmin.js');
const generateProds = require('../utils/mocking.js')

class ViewsController {


    landing(req, res) {
        const isAdmin = getRole(req) === 'admin';
        const isUser = getRole(req) === 'user';

        if (req.session.login) {
            return res.redirect("/products");
        }
        res.render("login", { req: req, isAdmin, isUser });
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

            const prods = await prodRepository.getProducts({
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const isAdmin = getRole(req) === 'admin';
            const isUser = getRole(req) === 'user';
            const cartId = req.user.cart.toString();

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
                totalPages: prods.totalPages,
                isAdmin,
                isUser,
                cartId

            });


        } catch (error) {

            req.logger.error('Error, no se han podido encontrar los productos', error);

            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }



    profile(req, res) {
        const isAdmin = getRole(req) === 'admin';
        const isUser = getRole(req) === 'user';

        if (req.session.user) {
            res.render('profile', {
                user: req.session.user,
                isAdmin,
                isUser
            })
        } else {
            res.redirect('/login')
        }
    }



    async getProductById(req, res) {
        try {
            const isAdmin = getRole(req) === 'admin';
            const isUser = getRole(req) === 'user';
            const cartId = req.user.cart.toString();

            const { prodId } = req.params;
            // Obtener producto por id
            const product = await prodRepository.getProductById(prodId)
            // Renderiza vista detalles del producto
            res.render('productDetail', {
                title: 'Product Detail',
                product,
                user: req.session.user,
                isAdmin,
                isUser,
                cartId
            });
        } catch (error) {
            req.logger.error('Error al intentar encontrar los detalles', error);
            // console.log(prodId)

            res.status(500).json({ error: 'Internal Server Error' })
        }
    }


    chat(req, res) {
        const { user } = req.session;
        const isAdmin = getRole(req) === 'admin';
        const isUser = getRole(req) === 'user';
        try {
            res.render('chat', { title: 'Real Time Chat', user, isUser, isAdmin })
        } catch (error) {
            req.logger.error('Error interno del servidor', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;
        const isAdmin = getRole(req) === 'admin';
        const isUser = getRole(req) === 'user';

        try {
            const cart = await cartRepository.getCartById(cartId);

            if (!cart) {
                req.logger.error(`No existe ese carrito con el id ${cartId} `);
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            let accumulatePrice = 0;

            const prodsInCart = cart.products.map(item => {

                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;


                accumulatePrice += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            })


            res.render("cart", { products: prodsInCart, cartId, accumulatePrice, isUser, isAdmin });
        } catch (error) {
            req.logger.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async error404(req, res) {
        const { user } = req.session;
        const isAdmin = getRole(req) === 'admin';
        const isUser = getRole(req) === 'user';
        res.render('error404', { title: 'Error', user, isUser, isAdmin })
    }


    async realTimeProducts(req, res) {
        try {
            const { user } = req.session;
            const isAdmin = getRole(req) === 'admin';
            const isUser = getRole(req) === 'user';

            res.render("realtimeproducts", { title: 'Real Time Products', user, isAdmin, isUser });

        } catch (error) {
            req.logger.error("Error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async noAdmin(req, res) {
        try {
            const { user } = req.session;
            const isAdmin = getRole(req) === 'admin';
            const isUser = getRole(req) === 'user';
            res.render('noAdmin', { title: 'Restricted Area', user, isUser, isAdmin })

        } catch (error) {
            req.logger.error("Error en la vista no Admin", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartById(cartId);

            if (!cart) {
                req.logger.info("No existe ese carrito con ese id");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }


            let totalPurchase = 0;

            const prodsInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;

                totalPurchase += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            res.render("cart", { productos: prodsInCart, totalPurchase, cartId, user: req.user });
        } catch (error) {
            req.logger.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async testing(req, res) {
        req.logger.fatal('Error Fatal');
        req.logger.error('Mensaje Error!');
        req.logger.warning('Mensaje Warning');
        req.logger.info('Mensaje Info');
        req.logger.http('Mensaje Http');
        req.logger.debug('Mensaje Debug');

        res.send('Hi, this is a logging test!');
    }

    async mocking(req, res) {
        const products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProds())
        }

        res.render('mocking', { products, user: req.user });
    }

    async showMocking(req, res) {
        const products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProds())
        }

        res.json(products)
    }
}

module.exports = ViewsController;