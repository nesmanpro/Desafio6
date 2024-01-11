// Primera preentrega PF-- Back-End--
const fs = require('fs');

class ProductManager {


    constructor(path) {
        this.path = path;
        this.products = this.readFile() || [];
        this.nextProductId = 1;
    }

    async init() {
        await this.readFile();
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

        // Verifica que el precio y el stock sean números y no estén indefinidos
        if (typeof price !== 'number' || typeof stock !== 'number') {
            console.log("Vaya! Parece que no han introducido un valor numerico en Precio y/o Stock .");
            return { status: 400, msg: "Error: Precio y stock deben ser numericos." };
        } else if (this.products.some(item => item.code === code)) {
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
            if (await fs.statSync(this.path)) {
                const response = await fs.readFileSync(this.path, 'utf8');
                console.log(response);
                this.products = JSON.parse(response);
                this.nextProductId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
                return this.products;
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("El archivo no existe. Se iniciará un nuevo arreglo de productos.");
                this.products = [];
            } else {
                throw error;
            }
        }
    }


    async saveFile(arrayProds) {
        try {
            await fs.writeFileSync(this.path, JSON.stringify(arrayProds, null, 2), 'utf8')
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

                const replacedProds = { ...arrayProds[indexProd], ...updatedProd, id: id };
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
                console.log(`Producto con id ${id} eliminado correctamente`)
            } else {
                console.log('No se encontro el producto que desea eliminar')
            }
        } catch (error) {
            console.log('Parece que hubo un problema con el elemento que desea eliminar', error)
        }

    }


}


module.exports = ProductManager;