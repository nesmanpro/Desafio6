// Primer desafio entregable -- Back-End--

class ProductManager {


    // Constructor con array vacio
    constructor() {
        this.products = [];
        this.productId = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        // Valida campos obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Te faltó uno de los campos, recordá que todos son obligatorios');
            return;
        }

        // Valida código único
        if (this.products.some(item => item.code === code)) {
            console.log('Vaya!, parece que el codigo esta repetido y debe ser unico.');
            return;
        }

        // Crea nuevo objeto con datos anteriores y id autoincrementable
        const newProduct = {
            id: ++this.productId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        // Agrega el nuevo producto al array
        this.products.push(newProduct);
    }

    getProducts() {
        console.log(this.products)
    }

    getProductsById(id, title) {
        const prod = this.products.find(item => item.id === id);

        if (prod) {
            console.log(`Genial! Se entontró el producto: ${prod.title} `, prod);
        } else {
            console.log('Vaya! No hemos encontrado el producto que buscas');
        }
        return prod;


    }

}


// ***** Ejemplo de uso: *****


//1) Crea instancia de clase “ProductManager”

const manager = new ProductManager();

//2) Llama a “getProducts” recién creada la instancia, devuelve array vacío []

manager.getProducts();

//3) Llama a “addProduct” :

manager.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25);


//4) El objeto se agrega con id unico


manager.addProduct("Arroz", "Para sushi", 200, "sin imagen", "abc124", 30);
manager.addProduct("Jamon", "Pata negra", 200, "sin imagen", "abc125", 50);

//5)Llama a “getProducts” nuevamente, aparecen productos recién agregados

manager.getProducts();


//6) Llama a “addProduct” campos repetidos, arrojar error por código repetido.

manager.addProduct("Arroz", "Para sushi", 200, "sin imagen", "abc124", 30);

//7) Llama a "getProductsById", devuelve error si no lo encuentra o devuelve el producto en caso de encontrarlo

manager.getProductsById(3);
manager.getProductsById(71);