// Primer desafio entregable -- Back-End--

class ProductManager {
    constructor() {
        this.product = [];
        this.productId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        // Validar campos obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Te faltó uno de los campos, recordá que todos son obligatorios');
            return;
        }

        // Validar código único
        if (this.product.some(item => item.code === code)) {
            console.log('Vaya!, parece que el codigo esta repetido.')
        }

        // Crear producto con id autoincrementable
        const newProduct = {
            id: this.productId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
    }


}