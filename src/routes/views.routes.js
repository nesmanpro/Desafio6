const express = require('express');
const router = express.Router();

// Service / controller
const ViewsController = require('../controller/viewsController.js');
const viewsController = new ViewsController();
const CartController = require('../controller/cartController.js');
const cartController = new CartController();

//importamos middleware de privilegios admin / user
const { isAdmin, isUser, gotAuth, isPremium } = require('../utils/userAdmin.js');



// Endpoint landing
router.get('/', viewsController.landing);
// Endpoint para el formulario de registro
router.get('/register', viewsController.register)
// Endpoint para el formulario de login
router.get('/login', viewsController.login);
// Endpoint para la vista de productos
router.get('/products', viewsController.getProducts);
// Endpoint para vista de perfil
router.get('/profile', viewsController.profile)
// Endpoint para gestionar error 404
router.get('/error', viewsController.error404)
// Endpoint para la vista productDetail.handlebars
router.get('/products/:prodId', viewsController.getProductById)
// Endpoint chat
router.get('/chat', isUser, viewsController.chat)
// Endpoint carrito ID
router.get('/carts/:cid', gotAuth, viewsController.renderCart);
// Endpoint realtimeprod
router.get('/realtime', isAdmin || isPremium, viewsController.realTimeProducts);
// Endpoint Restricted area
router.get('/restricted', viewsController.noAdmin);
// Endpoint test loggin
router.get('/loggerTest', viewsController.testing);
// Endpoint test mocking
router.get('/mockingproducts', viewsController.mocking);
router.get('/mokingjson', viewsController.showMocking);
// ticket
router.get('/:cid/purchase', cartController.endPurchase);
//Recuperar contraseña
router.get('/forgot', viewsController.forgot);
//Confirmacion envio 
router.get('/confirmationSent', viewsController.emailConfirmation);
//vista nueva contraseña
router.get('/reset-password', viewsController.resetPass);
// Vista premium
router.get('/premium', isPremium, viewsController.realTimeProducts);




module.exports = router;