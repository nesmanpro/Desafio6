
import express from 'express';
const router = express.Router();

// Service / controler
import ProductController from '../controller/productController.js';
const productController = new ProductController();

//importamos middleware de privilegios admin / user
import { isAdmin } from '../utils/userAdmin.js';


// Endpoint para obtener productos y filtrarlo con query y paginacion
router.get('/', productController.getProducts);
// Endpoint para obtener productos por id
router.get('/:pid', productController.getProductById);
// Endpoint para agregar producto
router.post('/', isAdmin, productController.addProduct);
// Endpoint para editar o sobreescribir producto
router.put('/:pid', isAdmin, productController.updateProduct);
// Endpoint para eliminar producto
router.delete('/:pid', isAdmin, productController.deleteProduct)


export default router;