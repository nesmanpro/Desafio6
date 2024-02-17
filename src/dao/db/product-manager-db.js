const ProdModel = require('../models/products.model.js');

class ProductManager {

    async addProduct(newObject) {
        try {

            let { title, description, code, price, stock, category, thumbnails = [], status = true } = newObject;

            if (!title || !description || !code || !category) {
                console.log('Te faltó uno de los campos de texto, recordá que todos son obligatorios');
                return { status: 400, msg: "Error: Te faltó uno de los campos de texto, recordá que todos son obligatorios (title, description, code, category)" };
            }

            if (typeof price !== 'number' || typeof stock !== 'number') {
                console.log("Vaya! Recuerda que precio y stock son valores numericos.");
                return { status: 400, msg: "Error: Recuerda que precio y stock son valores numericos." };
            }

            const existeProd = await ProdModel.findOne({ code: code });

            if (existeProd) {
                console.log('El código ya se encuentra registrado en la base de datos, introduce uno que sea unico.');
                return;
            }


            const newProduct = new ProdModel({
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                status,
                category
            });

            await newProduct.save();
            return newProduct;

        } catch (error) {
            console.log('Ocurrió un error al intentar crear el producto', error);
            throw error;

        }

    }

    async getProducts() {
        try {

            const productos = await ProdModel.find();
            return productos;

        } catch (error) {

            console.log('Ocurrio un error al obtener los productos', error);
        }
    }

    async getProductById(id) {
        try {

            const prodEncontrado = await ProdModel.findById(id);

            if (!prodEncontrado) {
                console.log('Ups! Producto no encontrado.');
                return null;
            } else {
                console.log('Producto encontrado!!');
                return prodEncontrado;

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

    async getProductsLimit(limit) {
        const products = await ProdModel.find()
        if (limit) {
            return products.slice(0, limit)
        }
        return products
    }
}

module.exports = ProductManager;