const express = require('express');
const router = express.Router();

const ProductManager = require('../dao/db/product-manager-db.js');
const prodManager = new ProductManager();



// Endpoint para obtener productos y filtrarlo con query y paginacion
router.get('/', async (req, res) => {

    try {

        const { limit = 10, page = 1, sort, query } = req.query;
        const prods = await prodManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: prods,
            totalPages: prods.totalPages,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            page: prods.page,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevLink: prods.hasPrevPage ? `/api/products?limit=${limit}&page=${prods.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: prods.hasNextPage ? `/api/products?limit=${limit}&page=${prods.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {

        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});


// Endpoint para obtener productos por id
router.get('/:pid', async (req, res) => {

    const pid = req.params.pid;

    try {
        const prod = await prodManager.getProductById(pid);
        const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
        if (prod) {
            res.json(prod)
        } else {
            res.json({ error })
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});

// Endpoint para agregar producto
router.post('/', async (req, res) => {

    const newProd = req.body;

    try {

        await prodManager.addProduct(newProd);
        res.status(201).json({ message: "Producto agregado exitosamente" });

    } catch (error) {

        console.error("Error al agregar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Endpoint para editar o sobreescribir producto
router.put('/:pid', async (req, res) => {

    let pid = req.params.pid;
    const updatedProd = req.body;

    try {

        await prodManager.updateProduct(pid, updatedProd);
        res.json({ message: "Producto actualizado exitosamente" });

    } catch (error) {

        console.log(error)
        res.status(500).json(error, `Error al intentar editar el producto con id ${pid}`)
    }
});


// Endpoint para eliminar producto
router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;

    try {
        await prodManager.deleteProduct(pid)
        res.send(`Producto ${pid} eliminado correctamente`)
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar eliminar el producto con id ${pid}`)
    }
})

module.exports = router;