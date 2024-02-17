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

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).lean().exec()

            if (!cart) {
                console.error(`No existe carrito con este ID: ${cartId}`)
                return cartId
            }

            // Vacia el array de productos del carrito
            cart.product = []
            await CartModel.findByIdAndUpdate(cartId, { products: cart.product }).exec()
        } catch (error) {
            console.error("Error eliminando el carrito!", error)
            throw error
        }
    }

    async deleteFromCart(cartId, productId) {
        try {
            // Busca el carrito por ID y actualiza el array de productos
            const updatedCart = await CartModel.findByIdAndUpdate(
                cartId,
                // Utiliza $pull para eliminar el producto del array
                { $pull: { products: { product: productId } } },
                // Devuelve el carrito actualizado
                { new: true }
            )

            if (!updatedCart) {
                console.error(`No existe ningun carrito con ID: ${cartId}`)
                return null
            }

            return updatedCart
        } catch (error) {
            console.error("Error eliminando el carrito", error)
            throw error
        }
    }

    async updateQuantity(cartId, prodId, newQuantity) {
        try {
            //Verifica si existe el carrito
            const cart = await this.getCartById(cartId)
            if (!cart) {
                console.error(`No existe ningun carrito con ID: ${cartId}`)
                return null
            }

            //Verifica si existe el producto en el carrito
            const prodToUpdate = cart.product.find(p => p.product.equals(prodId))
            if (!prodToUpdate) {
                console.error(`El producto con ID ${prodId} no se encontró en el carrito.`)
                return null
            }

            prodToUpdate.quantity = newQuantity;

            await cart.save()
            return cart
        } catch (error) {
            console.error("Error actualizando cantidad en el carrito", error)
            throw error
        }
    }


    async updateCart(cartId, newProds) {
        try {
            const updatedCart = await CartModel.findByIdAndUpdate(cartId, { products: newProds }, { new: true })
            return updatedCart
        } catch (error) {
            console.error("Error actualizando el carrito:", error)
            throw error;
        }
    }

}

module.exports = CartManager;