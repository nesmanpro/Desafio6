
import { Server } from 'socket.io';
import messageModel from '../models/message.model.js';
import ProductRepository from '../repositories/productRepository.js';
const productRepository = new ProductRepository();
import UserRepository from '../repositories/userRepository.js';
const userRepository = new UserRepository();
import CartRepository from '../repositories/cartRepository.js';
const cartRepository = new CartRepository();


class SocketManager {

    constructor(httpServer) {
        this.io = new Server(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("A client has connected");

            // prods
            socket.emit("products", await productRepository.getProducts());


            socket.on("deleteProd", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("addProd", async (producto) => {
                await productRepository.addProduct(producto);
                this.emitUpdatedProducts(socket);
            });

            // chat
            socket.on('messages', async (data) => {
                await messageModel.create(data);
                const messages = await messageModel.find();
                socket.emit('messages', messages);
            });

            // users
            socket.emit("users", await userRepository.getAllUsers());

            socket.on("deleteUser", async (user) => {
                try {
                    await userRepository.deleteUserById(user.id);
                    await cartRepository.deleteCartById(user.cart);
                    this.emitUpdatedProducts(socket);
                } catch (error) {
                    console.error('Error al intentar borrar el usuario:', error)
                }
            });

            socket.on("updateRole", async (dataUser) => {
                await userRepository.becomePremium(dataUser);
                this.emitUpdatedProducts(socket);
            });

            socket.on("deleteInactives", async () => {
                try {
                    await userRepository.deleteInactives();
                    this.emitUpdatedProducts(socket);
                } catch (error) {
                    console.error('Error al intentar borrar usuarios inactivos:', error)
                }
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productRepository.getProducts());
        socket.emit("users", await userRepository.getAllUsers());
    }


}

export default SocketManager;