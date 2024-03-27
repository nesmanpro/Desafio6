const ProductService = require('../service/productService.js');
const productService = new ProductService();

class ProductController {

    async getProducts(req, res) {

        try {

            const { limit = 10, page = 1, sort, query } = req.query;
            const prods = await productService.getProducts({
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
    }

    async addProduct(req, res) {
        const newProd = req.body;

        try {

            await productService.addProduct(newProd);
            res.status(201).json({ message: "Producto agregado exitosamente" });

        } catch (error) {

            console.error("Error al agregar producto", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    async getProductById(req, res) {

        const pid = req.params.pid;

        try {
            const prod = await productService.getProductById(pid);
            const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
            if (prod) {
                res.json(prod)
            } else {
                res.json({ error })
            }

        } catch (error) {
            res.status(500).json({ msg: 'Error interno del servidor' });
        }


    }

    async updateProduct(req, res) {

        let pid = req.params.pid;
        const updatedProd = req.body;

        try {

            await productService.updateProduct(pid, updatedProd);
            res.json({ message: "Producto actualizado exitosamente" });

        } catch (error) {

            console.log(error)
            res.status(500).json(error, `Error al intentar editar el producto con id ${pid}`)
        }
    }

    async deleteProduct(req, res) {

        let pid = req.params.pid;

        try {
            await productService.deleteProduct(pid)
            res.send(`Producto ${pid} eliminado correctamente`)
        } catch (error) {
            console.log(error)
            res.send(`Error al intentar eliminar el producto con id ${pid}`)
        }
    }

}

module.exports = ProductController;