
import ProductRepository from '../repositories/productRepository.js';

const productRepository = new ProductRepository();


export default class ProductController {

    async getProducts(req, res) {

        try {

            const { limit = 10, page = 1, sort, query } = req.query;
            const prods = await productRepository.getProducts({
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
                error: "Error en el servidor al acceder a los productos"
            });
        }
    }

    async addProduct(req, res) {
        const newProd = req.body;

        try {

            await productRepository.addProduct(newProd);
            res.status(201).json({ message: "Producto agregado exitosamente" });

        } catch (error) {
            req.logger.error("Error al agregar producto", error);
            res.status(500).json({ error: "Error al intentar añadir productos" });
        }
    }


    async getProductById(req, res) {

        const pid = req.params.pid;

        try {
            const prod = await productRepository.getProductById(pid);
            const error = { Error: 'Lo sentimos! no se ha encontrado el producto que andas buscando.' };
            if (prod) {
                res.json(prod)
            } else {
                res.json({ error })
            }

        } catch (error) {
            res.status(500).json({ msg: 'Error al traer un producto por ID' });
        }


    }

    async updateProduct(req, res) {

        let pid = req.params.pid;
        const updatedProd = req.body;

        try {

            await productRepository.updateProduct(pid, updatedProd);
            res.json({ message: "Producto actualizado exitosamente" });

        } catch (error) {
            req.logger.error('Error al editar el producto', error)
            res.status(500).json(error, `Error al intentar editar el producto con id ${pid}`)
        }
    }

    async deleteProduct(req, res) {

        let pid = req.params.pid;

        try {
            await productRepository.deleteProduct(pid)
            res.send(`Producto ${pid} eliminado correctamente`)
        } catch (error) {
            req.logger.error('Error al borrar el producto', error)
            res.send(`Error al intentar eliminar el producto con id ${pid}`)
        }
    }

}

