const CartService = require('../service/cartService.js');
const cartService = new CartService();


class CartController {

    async createCart(req, res) {
        try {
            const cart = await cartService.createCart();
            res.json(cart);
        } catch (error) {
            console.error("Error al crear un nuevo carrito", error);
            res.status(500).json({ error: "Error al crear un nuevo carrito" });
        }

    }

    async getCart(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await CartService.findById(cartId);
            if (!cart) {
                console.log("No existe ese carrito con el id");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            return res.json(cart.products);
        } catch (error) {
            res.status(500).json({ error: "Error al intentar acceder al carrito" });
        }
    }


    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const result = await cartService.addProductToCart(cartId, productId, quantity);
            res.json(result.products);
        } catch (error) {
            res.send('Error al intentar guardar producto en el carrito');
            res.status(400).json({ error: "Error al agregar producto al carrito" });
        }
    }

    async deleteProdFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await cartService.deleteProdFromCart(cartId, productId);
            res.json({
                status: 'success',
                message: 'El producto se ha eliminado del carrito satisfactoriamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error al eliminar un producto del servidor',
            });
        }
    }

    async updateCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartService.updateCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error al actualizar el carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error al actualizar el carrito',
            });
        }
    }


    async updateProdQuantity(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const newQuantity = req.body.quantity;
            const updatedCart = await cartService.updateProdQuantity(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error actualizar la cantidad de productos',
            });
        }
    }

    async emptyCart(req, res) {
        try {
            const cartId = req.params.cid;
            const updatedCart = await cartService.emptyCart(cartId);
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al vaciar el carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error al vaciar el carrito',
            });
        }
    }


}

module.exports = CartController;