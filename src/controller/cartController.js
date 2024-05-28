import CartRepository from '../repositories/cartRepository.js';
const cartRepository = new CartRepository();

import ProductRepository from '../repositories/productRepository.js';
const productRepository = new ProductRepository();

import TicketModel from '../models/tickets.model.js';
import UserModel from "../models/user.model.js";

import { getRole } from '../utils/userAdmin.js';
import { codeGen, totalPrice } from "../utils/cartLogic.js";
import MailingManager from "../utils/mailing.js";
const mailingManager = new MailingManager();


export default class CartController {

    async createCart(req, res) {
        try {
            const cart = await cartRepository.createCart();
            res.json(cart);
        } catch (error) {
            req.logger.error("Error al crear un nuevo carrito", error);
            res.status(500).json({ error: "Error al crear un nuevo carrito" });
        }

    }

    async getCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getCartById(cartId);
            if (!cart) {
                req.logger.warning('No existe ese carrito con el id');
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            return res.json(cart.products);
        } catch (error) {
            res.status(500).json({ error: "Error al intentar acceder al carrito" });
        }
    }


    async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartRepository.addProductToCart(cartId, prodId, quantity);
            res.redirect(`/carts/${cartId}`);
            // res.json(result.products);
        } catch (error) {
            res.send('Error al intentar guardar producto en el carrito');
            res.status(400).json({ error: "Error al agregar producto al carrito" });
        }
    }

    async deleteProdFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const updatedCart = await cartRepository.deleteProdFromCart(cartId, productId);
            res.json({
                status: 'success',
                message: 'El producto se ha eliminado del carrito satisfactoriamente',
                updatedCart,
            });
        } catch (error) {
            req.logger.error('Error al eliminar el producto del carrito', error);
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
            const updatedCart = await cartRepository.updateCart(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            req.logger.error('Error al actualizar el carrito', error);
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
            const updatedCart = await cartRepository.updateProdQuantity(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            req.logger.error('Error al actualizar la cantidad del producto en el carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error actualizar la cantidad de productos',
            });
        }
    }

    async emptyCart(req, res) {
        try {
            const cartId = req.params.cid;
            const updatedCart = await cartRepository.emptyCart(cartId);
            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });
        } catch (error) {
            req.logger.error('Error al vaciar el carrito', error);
            res.status(500).json({
                status: 'error',
                error: 'Error al vaciar el carrito',
            });
        }
    }


    async endPurchase(req, res) {
        const cartId = req.params.cid;
        const { user } = req.session;
        const isUser = getRole(req) === 'user';
        try {
            // Obtener carrito y productos
            const cart = await cartRepository.getCartById(cartId);
            const products = cart.products;

            // Arreglo vacío para productos no disponibles
            const productNotAvailable = [];

            // Checar stock y actualizar productos disponibles
            for (const item of products) {
                const prodId = item.product;
                const product = await productRepository.getProductById(prodId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente, restar cantidad
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no, agregar ID al arreglo de no disponibles
                    productNotAvailable.push(prodId);
                }
            }

            const userCart = await UserModel.findOne({ cart: cartId });

            // Obtener nombres de los productos usando map
            const productNames = products.map(item => item.product.title);
            // Concatenar los nombres de los productos separados por comas
            const productNamesString = productNames.join(', ');

            // Crear ticket con datos de compra
            const ticket = new TicketModel({
                code: codeGen(),
                purchase_datetime: new Date(),
                amount: totalPrice(cart.products),
                name: userCart.first_name,
                purchaser: userCart.email,
                not_available: productNotAvailable,
                products: cart.products
            });
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => productNotAvailable.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();


            // Enviar email con datos de compra
            await mailingManager.sendMailPurchase(ticket.purchaser, ticket.name, ticket._id, productNamesString)


            res.render('checkout', { ticket: ticket, title: 'Haciendo el Checkout', user: user, isUser })
            console.log(products)
            // res.status(200).json({ productNotAvailable });
        } catch (error) {
            req.logger.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }


}
