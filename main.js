// Segundo desafio entregable -- Back-End--
const fs = require('fs');

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


    }

    // Nuevo codigo Desafio 2

    async readFile() {
        try {
            const response = await fs.readFileSync(this.path, 'utf-8');
            const arrayProds = JSON.parse(response);
            return arrayProds;
        } catch (error) {
            console.log('Error! Parece que no se ha leido el archivo', error)
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
            const indexProd = arrayProds.findIndex(item => item.id === id);

            if (indexProd !== -1) {

                arrayProds.splice(indexProd, 1);
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


// ***** Testeo de uso: *****


// Crear instancia ProductManager.

const manager = new ProductManager('./products.json');

// Llamar a getProducts, devuelve array vacio.

manager.getProducts();

// LLamar metodo addProducts y agregamos 3 productos


const arroz = {
    title: "Arroz",
    description: "Ideal para sushi",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 20
}

manager.addProduct(arroz);

const choco = {
    title: "Chocolate",
    description: "en rama",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25
}

manager.addProduct(choco);


const carne = {
    title: "carne",
    description: "Tapa de cuadril",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc125",
    stock: 25
}

manager.addProduct(carne);

// Omitimos campo stock de producto

const cafe = {
    title: "café",
    description: "Etíope de especialidad",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc126",
    // stock: 25
}

manager.addProduct(cafe);

// Repetimos codigo producto

const pan = {
    title: "pan",
    description: "de molde bimbo",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 25
}

manager.addProduct(pan);


// mostrar producto recien agregados mediante getProducts()

manager.getProducts();

// llamar getProductById() 

async function GettingById() {
    const searching = await manager.getProductsById(2);
    return console.log(searching)
}

GettingById();

// Llamar metodo updateProducts para sustituir producto


const provo = {
    title: "Provolone",
    description: "provolone ahumado",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc127",
    stock: 25
};

async function testUpdate() {
    await manager.updateProduct(1, provo);

}

testUpdate();

// Llamar testDelete() para eliminar producto

async function testDelete() {
    await manager.deleteProduct(3);

}

testDelete();