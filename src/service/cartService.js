const CartModel = require('../dao/models/cart.model.js');


class CartService {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log('Error al crear el nuevo carrito', error)
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
            const ProdExist = carrito.products.find(item => item.product.toString() === prodId);

            if (ProdExist) {
                ProdExist.quantity += quantity;
            } else {
                carrito.products.push({ product: prodId, quantity });
            }

            carrito.markModified('products');

            await carrito.save();
            return carrito;

        } catch (error) {

            console.log('No se pudo agregar el producto al carrito', error)

        }
    }


    async deleteProdFromCart(cartId, prodId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== prodId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            throw error;
        }
    }


    async updateCart(cartId, updatedProds) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('No se ha encontrado el carrito');
            }

            cart.products = updatedProds;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito', error);
            throw error;
        }
    }

    async updateProdQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('El carrito no se ha encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar el numero de productos en el carrito', error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito', error);
            throw error;
        }
    }

}

module.exports = CartService;