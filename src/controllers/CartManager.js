// Tercer desafio entregable -- Back-End--
const fs = require('fs/promises');

class CartManager {


    constructor(path) {
        this.path = path;
        this.carts = [];
        this.cartId = 0;
        this.readFile();
    }


    async readFile() {
        try {
            const response = await fs.readFile(this.path, 'utf-8');
            const arrayCarts = JSON.parse(response);
            return arrayCarts;
        } catch (error) {
            console.log('Error! Parece que no se ha leido el archivo', error)
            return [];
        }
    }

    async saveFile(arrayCarts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2))
        } catch (error) {
            console.log('Error! no se ha podido guardar el archivo', error)
        }
    }



    async newCart() {
        let existingCart = await this.readFile();
        const nextCartId = nextCartIdexistingCart.length > 0 ? Math.max(...existingCart.map(p => p.id)) + 1 : 1;

        const newCart = { id: nextCartId, products: [] }
        this.carts.push(newCart);
        await this.saveCarts();

        return newCart;
    }



    async getCartProds(id) {
        try {
            const arrayCarts = await this.readFile();
            const cart = arrayCarts.find(item => item.id === id);

            if (cart) {
                console.log(`Genial! Se entontró el Carrito! ${cart.title}`);
                return cart.products;
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

    async addProdToCart(cid, pid) {

        const arrayCarts = await this.readFile();
        const index = arrayCarts.findIndex(cart => cart.id === cid)

        if (index !== -1) {
            const cartProds = await this.getCartProds(cid);
            const existingProdIndex = cartProds.findIndex(prod => prod.id === pid)

            if (existingProdIndex !== -1) {
                cartProds[existingProdIndex].quantity = cartProds[existingProdIndex].quantity + 1;
            } else {
                cartProds.push({ pid, quantity: 1 })
            }

            arrayCarts[index].products = cartProds;

            console.log('Producto agregado con exito!')
            return saveFile(arrayCarts);
        } else {
            console.log('carrito no encontrado')
        }




        // const arrayCarts = await this.getCartsById(cartId);
        // const cart = await this.getCartById(cartId);
        // if (arrayCarts.error) return cart;

        // const productIndex = arrayCarts.products.findIndex(p => p.id === prodId);
        // if (productIndex > -1) {
        //     arrayCarts.products[productIndex].quantity += quantity;
        // } else {
        //     arrayCarts.products.push({ id: prodId, quantity });
        // }

        // await this.saveFile();
        // return arrayCarts;

    }


}


module.exports = CartManager;