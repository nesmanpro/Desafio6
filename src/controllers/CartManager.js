// Tercer desafio entregable -- Back-End--
const fs = require('fs');

class CartManager {


    constructor(path) {
        this.path = path;
        this.carts = [];
        this.cartId = 0;
        this.readFile();
    }

    // async addCart(newObject) {

    //     // desestructurando el nuevo objeto
    //     let { title, description, price, thumbnail, code, stock } = newObject;

    //     if (!title || !description || !price || !thumbnail || !code || !stock) {
    //         console.log('Te faltó uno de los campos, recordá que todos son obligatorios');
    //         return;
    //     }

    //     if (this.carts.some(item => item.code === code)) {
    //         console.log('Vaya!, parece que el codigo esta repetido y debe ser unico.');
    //         return;
    //     }

    //     const newCart = {
    //         id: ++this.cartId,
    //         title,
    //         description,
    //         price,
    //         thumbnail,
    //         code,
    //         stock
    //     }

    //     this.carts.push(newCart);

    //     // guardando array
    //     await this.saveFile(this.carts);
    // }

    // async getCarts() {
    //     if (!this.carts || this.carts.length === 0) {
    //         return await this.readFile()
    //     }
    //     return this.carts;
    // }

    // Nuevo codigo Desafio 2

    async readFile() {
        try {
            const response = await fs.readFileSync(this.path, 'utf-8');
            const arrayCarts = JSON.parse(response);
            this.productId = arrayCarts.reduce((max, cart) => Math.max(max, cart.id), 0) + 1;
            return arrayCarts;
        } catch (error) {
            console.log('Error! Parece que no se ha leido el archivo', error)
            return [];
        }
    }

    async saveFile(arrayCarts) {
        try {
            await fs.writeFileSync(this.path, JSON.stringify(arrayCarts, null, 2))
        } catch (error) {
            console.log('Error! no se ha podido guardar el archivo', error)
        }
    }

    async createCart() {
        const cart = { id: this.cartId++, products: [] };
        this.carts.push(cart);
        await this.saveFile();
        return cart;
    }

    async getCartsById(id) {
        try {
            const arrayCarts = await this.readFile();
            const cart = arrayCarts.find(item => item.id === id);

            if (cart) {
                console.log(`Genial! Se entontró el Carrito! ${cart.title}`);
                return cart;
            } else {
                console.log('Vaya! No hemos encontrado el carrito que buscas');
                return null;
            }

        } catch (error) {
            console.log('Error al leer el archivo', error)
            throw error;
        }

    }


    // actualizar Carrito

    async updateCart(cartId, prodId, quantity = 1) {

        const arrayCarts = await this.getCartsById(cartId);
        const cart = await this.getCartById(cartId);
        if (arrayCarts.error) return cart;

        const productIndex = arrayCarts.products.findIndex(p => p.id === prodId);
        if (productIndex > -1) {
            arrayCarts.products[productIndex].quantity += quantity;
        } else {
            arrayCarts.products.push({ id: prodId, quantity });
        }

        await this.saveFile();
        return arrayCarts;

    }


}


module.exports = CartManager;