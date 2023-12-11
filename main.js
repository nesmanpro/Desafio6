// Segundo desafio entregable -- Back-End--
const fs = require('fs').promises;

class ProductManager {


    constructor(path) {
        this.products = [];
        this.path = path;
        this.productId = 0;
    }

    async addProduct(newObject) {

        // desestructurando el nuevo objeto
        let { title, description, price, thumbnail, code, stock } = newObject;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Te faltó uno de los campos, recordá que todos son obligatorios');
            return;
        }

        if (this.products.some(item => item.code === code)) {
            console.log('Vaya!, parece que el codigo esta repetido y debe ser unico.');
            return;
        }

        const newProduct = {
            id: ++this.productId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct);

        // guardando array
        await this.saveFile(this.products);
    }

    getProducts() {
        console.log(this.products)
    }

    async getProductsById(id) {
        try {
            const arrayProducts = await this.readFile();
            const prod = arrayProducts.find(item => item.id === id);

            if (prod) {
                console.log(`Genial! Se entontró el producto!`);
                return prod;
            } else {
                console.log('Vaya! No hemos encontrado el producto que buscas');
            }

        } catch (error) {
            console.log('Error al leer el archivo', error)
        }





        // const prod = this.products.find(item => item.id === id);

        // if (prod) {
        //     console.log(`Genial! Se entontró el producto: ${prod.title} `, prod);
        // } else {
        //     console.log('Vaya! No hemos encontrado el producto que buscas');
        // }
        // return prod;


    }

    // Nuevo codigo Desafio 2

    async readFile() {
        try {
            const response = await fs.readFile(this.path, 'utf-8');
            const arrayProds = JSON.parse(response);
            return arrayProds;
        } catch (error) {
            console.log('Error! Parece que no se ha leido el archivo', error)
        }
    }

    async saveFile(arrayProds) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProds, null, 2))
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
                arrayProds.splice(indexProd, 1, updatedProd);
                await this.saveFile(arrayProds);
            } else {
                console.log('No se encontro el producto')
            }
        } catch (error) {
            console.log('Parece que hubo un problema con la actualizacion', error)
        }
    }

}


// ***** Testeo de uso: *****


// Crear instancia ProductManager.

const manager = new ProductManager('./products.json');

// Llamar a getProducts, devuelve array vacio.

manager.getProducts();

// LLamar metodo addProducts


const prod1 = {
    title: "producto 1",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 20
}

manager.addProduct(prod1);

const prod2 = {
    title: "producto 2",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25
}

manager.addProduct(prod2);

// Omitimos campo stock de producto

const prod3 = {
    title: "producto 3",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc125",
    // stock: 25
}

manager.addProduct(prod3);

// R epetimos codigo producto

const prod4 = {
    title: "producto 4",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25
}

manager.addProduct(prod4);


// mostrar producto recien agregados mediante getProducts()

manager.getProducts();

// llamar getProductById() 

async function GettingById() {
    const searching = await manager.getProductsById(2);
    return console.log(searching)
}

GettingById();