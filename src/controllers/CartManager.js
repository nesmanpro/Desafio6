// Primera preentrega PF-- Back-End--
const fs = require('fs').promises;

class CartManager {


    constructor(path) {
        this.path = path;
        this.carts = [];
        this.nextCartId = 1;
        this.loadCarts();
    }



    async newCart() {
        const cart = { id: this.nextCartId++, products: [] };
        this.carts.push(cart);
        await this.saveCarts();
        return cart;
    }

    async addToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        if (cart.error) return cart;

        const productIndex = cart.products.findIndex(prod => prod.id === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }

    async loadCarts() {
        try {
            const response = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(response);
            this.nextCartId = this.carts.reduce((max, cart) => Math.max(max, cart.id), 0) + 1;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("No existe carrito alguno aun. Se ha creado un nuevo carrito.");
                this.carts = [];
            } else {
                throw error;
            }
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
    }


    async getCartById(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        return cart || { error: 'Ups! el carrito no encontrado' };
    }


}

module.exports = CartManager;