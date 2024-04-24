const ProdModel = require('../models/products.model.js');


class ProductRepository {

    async addProduct(newObject) {
        try {
            let { title, description, code, img, price, stock, category, thumbnails = [], status = true } = newObject;

            if (!title || !description || !code || !category) {


                req.logger.warning('Te faltó uno de los campos de texto, recordá que todos son obligatorios');
                return { status: 400, msg: "Error: Te faltó uno de los campos de texto, recordá que todos son obligatorios (title, description, code, category)" };
            }

            if (typeof price !== 'number' || typeof stock !== 'number') {

                req.logger.warning("Vaya! Recuerda que precio y stock son valores numericos.");
                return { status: 400, msg: "Error: Recuerda que precio y stock son valores numericos." };
            }

            const prodExist = await ProdModel.findOne({ code: code });

            if (prodExist) {

                req.logger.warning('El código ya se encuentra registrado en la base de datos, introduce uno que sea unico.');
                return;
            }


            const newProduct = new ProdModel({
                title,
                description,
                price,
                thumbnails,
                code,
                img,
                stock,
                status,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
            return newProduct;

        } catch (error) {

            req.logger.error('Ocurrió un error al intentar crear el producto', error);
            throw error;

        }

    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {

            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const prods = await ProdModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProds = await ProdModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProds / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: prods,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } catch (error) {
            req.logger.error('Ups! Parece que ha habido un error al obtener los productos', error);
        }
    }

    async getProductById(id) {
        try {

            const prodFound = await ProdModel.findById(id);

            if (!prodFound) {
                req.logger.warning('Ups! Producto no encontrado.');
                return null;
            } else {
                req.logger.info('Producto encontrado!!');
                return prodFound;

            }

        } catch (error) {
            req.logger.error('Error al traer un producto por id.');

        }
    }

    async updateProduct(id, updatedProd) {

        try {

            const updated = await ProdModel.findByIdAndUpdate(id, updatedProd);

            if (!updated) {
                req.logger.warning('No se encuentra el producto!');
                return null;
            }

            req.logger.info('Producto actualizado con exito!');
            return updated;

        } catch (error) {
            req.logger.error('Parece que hubo un problema con la actualizacion', error)

        }
    }

    async deleteProduct(id) {
        try {
            const deleted = await ProdModel.findByIdAndDelete(id);

            if (!deleted) {
                req.logger.warning("El producto no encontrado");
                return null;
            }
            req.logger.info("Se elimino correctamente")



        } catch (error) {
            req.logger.error('Parece que hubo un problema con el elemento que desea eliminar', error)
        }
    }

    async getProductsLimit(limit) {
        const products = await ProdModel.find()
        if (limit) {
            return products.slice(0, limit)
        }
        return products
    }
}

module.exports = ProductRepository;