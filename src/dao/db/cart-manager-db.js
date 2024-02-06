const CartModel = require('../models/cart.model.js');

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log('No se pudo crear el nuevo carrito', error)
        }
    }

    async getCartById(CartId) {
        try {

            const cart = CartModel.findById(CartId);
            if (!cart) {
                console.log('No existe ese carrito con id:' + CartId)
                return null;
            }
            return cart;

        } catch (error) {

            console.log('No se pudo traer el carrito', error)
        }
    }

    async addProductToCart(cartId, prodId, quantity = 1) {
        try {

            const carrito = await this.getCartById(cartId);
            const cartExist = carrito.product.find(item => item.product.toString() === prodId);

            if (cartExist) {
                cartExist.quantity += quantity;
            } else {
                carrito.product.push({ product: prodId, quantity });
            }

            carrito.markModified('products');

            await carrito.save();
            return carrito;

        } catch (error) {

            console.log('No se pudo agregar el producto al carrito', error)

        }
    }
}

module.exports = CartManager;