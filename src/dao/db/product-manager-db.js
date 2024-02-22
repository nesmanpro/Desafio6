const ProdModel = require('../models/products.model.js');

class ProductManager {

    async addProduct(newObject) {
        try {

            let { title, description, code, img, price, stock, category, thumbnails = [], status = true } = newObject;

            if (!title || !description || !code || !category) {
                console.log('Te faltó uno de los campos de texto, recordá que todos son obligatorios');
                return { status: 400, msg: "Error: Te faltó uno de los campos de texto, recordá que todos son obligatorios (title, description, code, category)" };
            }

            if (typeof price !== 'number' || typeof stock !== 'number') {
                console.log("Vaya! Recuerda que precio y stock son valores numericos.");
                return { status: 400, msg: "Error: Recuerda que precio y stock son valores numericos." };
            }

            const prodExist = await ProdModel.findOne({ code: code });

            if (prodExist) {
                console.log('El código ya se encuentra registrado en la base de datos, introduce uno que sea unico.');
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
            console.log('Ocurrió un error al intentar crear el producto', error);
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

            console.log('Ups! Parece que ha habido un error al obtener los productos', error);
        }
    }

    async getProductById(id) {
        try {

            const prodFound = await ProdModel.findById(id);

            if (!prodFound) {
                console.log('Ups! Producto no encontrado.');
                return null;
            } else {
                console.log('Producto encontrado!!');
                return prodFound;

            }

        } catch (error) {
            console.log('Error al traer un producto por id.');

        }
    }

    async updateProduct(id, updatedProd) {

        try {

            const updated = await ProdModel.findByIdAndUpdate(id, updatedProd);

            if (!updated) {
                console.log('No se encuentra el producto!');
                return null;
            }

            console.log('Producto actualizado con exito!');
            return updated;

        } catch (error) {

            console.log('Parece que hubo un problema con la actualizacion', error)

        }
    }

    async deleteProduct(id) {
        try {
            const deleted = await ProdModel.findByIdAndDelete(id);

            if (!deleted) {
                console.log("El producto no encontrado");
                return null;
            }
            console.log("Se elimino correctamente")



        } catch (error) {
            console.log('Parece que hubo un problema con el elemento que desea eliminar', error)
        }
    }
}

module.exports = ProductManager;