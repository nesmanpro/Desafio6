const express = require('express');
const router = express.Router();

// Service / controler
const ProductController = require('../controller/productController.js');
const productController = new ProductController();



// Endpoint para obtener productos y filtrarlo con query y paginacion
router.get('/', productController.getProducts);

// Endpoint para obtener productos por id
router.get('/:pid', productController.getProductById);

// Endpoint para agregar producto
router.post('/', productController.addProduct);

// Endpoint para editar o sobreescribir producto
router.put('/:pid', productController.updateProduct);

// Endpoint para eliminar producto
router.delete('/:pid', productController.deleteProduct)

module.exports = router;