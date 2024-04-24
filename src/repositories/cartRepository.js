const CartModel = require('../models/cart.model.js');


class CartRepository {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            req.logger.error("Error al crear el carrito");
            throw new Error("Error al crear el carrito");
        }
    }

    async getCartById(CartId) {
        try {
            const cart = CartModel.findById(CartId);
            if (!cart) {
                req.logger.warning('No existe ese carrito con id:' + CartId)
                return null;
            }
            return cart;
        } catch (error) {
            throw new Error('Error! No se pudo traer el carrito');
        }
    }

    async addProductToCart(cartId, prodId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const existingProduct = cart.products.find(item => item.product._id.toString() === prodId);

            if (existingProduct) {

                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: prodId, quantity });
            }

            cart.markModified('products');

            await cart.save();
            return cart;

        } catch (error) {
            throw new Error('Error! No se pudo agregar el producto al carrito')
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
            throw new Error('Error al eliminar el producto del carrito');
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
            req.logger.error('Error al actualizar el carrito', error);
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
            req.logger.error('Error al actualizar el numero de productos en el carrito', error);
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
            req.logger.error('Error al vaciar el carrito', error);
            throw error;
        }
    }

}

module.exports = CartRepository;