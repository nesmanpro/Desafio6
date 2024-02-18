const express = require('express');
const router = express.Router();
const ProductModel = require("../dao/models/products.model.js")
const ProductManager = require('../dao/db/product-manager-db.js');
const prodManager = new ProductManager();



// Endpoint para obtener productos y filtrarlo con paginación, filtros y orden
router.get('/', async (req, res) => {
    try {
        let { limit, page, sort, query: filterQuery } = req.query
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        // Ordenado alfabetico (ascendento o descendente)
        let sortProd = {};

        if (sort) {
            sortProd.price = (sort === 'asc') ? 1 : -1;
        }

        // Filtrado por categoría
        const filter = {}
        if (filterQuery) {
            filter.category = filterQuery;
        }


        const allProds = await ProductModel.paginate(filterOptions, { limit, page, sort: sortOptions });


        const prodsResult = allProds.docs.map(prod => {
            const { id, ...rest } = prod.toObject()
            return rest
        })

        // Enlaces de previo y siguiente
        const prev = allProds.hasPrevPage ? `/api/products?limit=${limit}&page=${allProds.prevPage}&sort=${sort}&query=${filterQuery}` : null;
        const next = allProds.hasNextPage ? `/api/products?limit=${limit}&page=${allProds.nextPage}&sort=${sort}&query=${filterQuery}` : null;

        // Objeto para paginacio
        const response = {
            status: 'success',
            payload: prodsResult,
            totalDocs: allProds.totalDocs,
            totalPages: allProds.totalPages,
            prevPage: allProds.prevPage,
            nextPage: allProds.nextPage,
            page: allProds.page,
            hasPrevPage: allProds.hasPrevPage,
            hasNextPage: allProds.hasNextPage,
            prev,
            next
        }
        // Se envia la respuesta
        res.json(response)

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Endpoint para obtener productos por id
router.get('/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
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
    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;

        const response = await prodManager.addProduct({ title, description, code, price, stock, category, thumbnails, status });
        res.json(response)
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar agregar un producto`)
    }
});

// Endpoint para editar o sobreescribir producto
router.put('/:pid', async (req, res) => {

    let pid = req.params.pid;
    const prod = await prodManager.getProductById(pid);

    try {
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;
        const response = await prodManager.updateProduct(pid, { title, description, code, price, stock, category, thumbnails, status });
        if (prod !== null) {
            res.send('Producto actualizado con exito!');
        } else {
            res.send(`Parece que el producto con id ${pid} no existe.`)
        }
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar editar el producto con id ${pid}`)
    }
});


// Endpoint para eliminar producto
router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;
    console.log('Valor de pid:', pid);
    try {
        await prodManager.deleteProduct(pid)
        res.send(`Producto ${pid} eliminado correctamente`)
    } catch (error) {
        console.log(error)
        res.send(`Error al intentar eliminar el producto con id ${pid}`)
    }
})

module.exports = router;