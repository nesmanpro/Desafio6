const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/ProductManager');
const productManager = new ProductManager('./src/models/products.json');

// Ruta Get (/api/products/)

router.get('/', async (req, res) => {
    let { limit } = req.query;
    try {
        const allProds = await ProductManager.getProducts();
        const products = await ProductManager.getProducts();
        if (!isNaN(limit)) {
            const limitedProducts = allProds.slice(0, limit);
            res.send(limitedProducts);
        } else {
            res.send(allProds);
        }
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});


// Ruta Get (/api/products/:pid)


router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const prod = await productManager.getProductsById(pid);
        const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
        if (prod) {
            res.json(prod)
        } else {
            res.send({ error })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

// Ruta Post (/api/products/)
router.post('/', async (req, res) => {
    const { title, description, price, category, thumbnail, code, stock } = req.body;
    await productManager.addProduct({ title, description, category, price, thumbnail, code, stock });
    res.json({ message: 'El producto se ha agregado con éxito' });
});


// Ruta Put (/api/products/:pid)
router.put('/:pid', async (req, res) => {

    const productId = parseInt(req.params.pid)
    const updatedProduct = req.body;

    await productManager.updateProduct(productId, updatedProduct);
    res.json({ msg: 'Genial! El producto fue actualizado con éxito' });
});

// Ruta Delete (/api/products/:pid)
router.delete('/:pid', async (req, res) => {

    const productId = parseInt(req.params.pid);

    await productManager.deleteProduct(productId);
    res.json({ msg: 'Genial! El producto fue eliminado con éxito' });

    const products = await productManager.getProducts();
    res.send(products);
});

module.exports = router;