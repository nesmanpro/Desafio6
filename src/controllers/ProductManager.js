const fs = require('fs');

class ProductManager {


    constructor(path) {
        this.products = [];
        this.path = path;
        this.productId = 0;
    }

    async addProduct(newObject) {

        // desestructurando el nuevo objeto
        let { title, description, code, price, stock, category, thumbnails = [], status = true } = newObject;

        if (!title || !description || !code || !category) {
            console.log('Te faltó uno de los campos de texto, recordá que todos son obligatorios');
            return { status: 400, msg: "Error: Te faltó uno de los campos de texto, recordá que todos son obligatorios (title, description, code, category)" };
        }

        if (typeof price !== 'number' || typeof stock !== 'number') {
            console.log("Vaya! Recuerda que precio y stock son valores numericos.");
            return { status: 400, msg: "Error: Recuerda que precio y stock son valores numericos." };
        }

        if (this.products.some(item => item.code === code)) {
            console.log('Vaya!, parece que el codigo esta repetido y debe ser unico.');
            return console.log('Vaya!, parece que el codigo esta repetido y debe ser unico.');;
        }

        let existingProducts = await this.readFile();

        const newProduct = {
            id: existingProducts.length > 0 ? Math.max(...existingProducts.map(p => p.id)) + 1 : 1,
            title,
            description,
            price: Number(price),
            thumbnails,
            code,
            stock: Number(stock),
            status,
            category
        }

        this.products.push(newProduct);
        const updatedProducts = [...existingProducts, newProduct];

        // guardando array
        await this.saveFile(updatedProducts);
        console.log(`El producto ${title} se agregó con éxito.`);
        return newProduct;
    }

    async getProducts() {
        if (!this.products || this.products.length === 0) {
            return this.readFile()
        }
        return this.products;
    }

    async getProductsById(id) {
        try {
            const arrayProducts = await this.readFile();
            const prod = arrayProducts.find(item => item.id === id);

            if (prod) {
                console.log(`Genial! Se entontró el producto! ${prod.title}`);
                return prod;
            } else {
                console.log('Vaya! No hemos encontrado el producto que buscas');
                return null;
            }

        } catch (error) {
            console.log('Error al leer el archivo', error)
            throw error;
        }


    }


    async readFile() {
        try {
            const response = await fs.readFileSync(this.path, 'utf-8');
            const arrayProds = JSON.parse(response);
            return arrayProds;
        } catch (error) {
            console.log('Error! Parece que no se ha leido el archivo', error)
            return [];
        }
    }


    async saveFile(arrayProds) {
        try {
            await fs.writeFileSync(this.path, JSON.stringify(arrayProds, null, 2))
        } catch (error) {
            console.log('Error! no se ha podido guardar el archivo', error)
        }
    }

    // actualizar producto

    async updateProduct(id, updatedProd) {
        try {
            const arrayProds = await this.readFile();
            const indexProd = arrayProds.findIndex(item => item.id === id);

            if (indexProd !== -1) {

                const replacedProds = { ...arrayProds[indexProd], ...updatedProd }
                arrayProds.splice(indexProd, 1, replacedProds);
                await this.saveFile(arrayProds);
                console.log('Producto actualizado correctamente')
                return replacedProds;
            } else {
                console.log('No se encontro el producto')
            }
        } catch (error) {
            console.log('Parece que hubo un problema con la actualizacion', error)
        }
    }

    // Borrar producto

    async deleteProduct(id) {
        try {
            const arrayProds = await this.readFile();
            const indexDelProd = arrayProds.findIndex(item => item.id === id);
            console.log('ID a eliminar:', id);
            console.log('ID de productos en el array:', arrayProds.map(item => item.id));
            if (indexDelProd !== -1) {

                arrayProds.splice(indexDelProd, 1);
                await this.saveFile(arrayProds);
                console.log('Producto eliminado correctamente')
            } else {
                console.log('No se encontro el producto que desea eliminar')
            }
        } catch (error) {
            console.log('Parece que hubo un problema con el elemento que desea eliminar', error)
        }
    }

}


module.exports = ProductManager;