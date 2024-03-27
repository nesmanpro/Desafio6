const express = require('express');
const router = express.Router();

// Service / controller
const ViewsController = require('../controller/viewsController.js');
const viewsController = new ViewsController();


// Endpoint para el formulario de registro
router.get("/", viewsController.landing);

router.get('/register', viewsController.register)

// Endpoint para el formulario de login
router.get("/login", viewsController.login);


// Endpoint para la vista de productos
router.get('/products', viewsController.getProducts);

// Endpoint para vista de perfil

router.get('/profile', viewsController.profile)




// Endpoint para la vista productDetail.handlebars
router.get('/products/:prodId', viewsController.getProductById)


router.get('/chat', viewsController.chat)

router.get("/carts/:cid", viewsController.getCartById);

module.exports = router;