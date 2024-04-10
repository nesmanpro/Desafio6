const socket = require('socket.io');
const messageModel = require("../models/message.model.js");
const ProductRepository = require("../repositories/productRepository.js");
const productRepository = new ProductRepository();

class SocketManager {

    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("A client has connected");

            socket.emit("products", await productRepository.getProducts());

            socket.on("deleteProd", async (id) => {
                await productRepository.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("addProd", async (producto) => {
                await productRepository.addProduct(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on('messages', async (data) => {
                await messageModel.create(data);
                const messages = await messageModel.find();
                socket.emit('messages', messages);
            });
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("products", await productRepository.getProducts());
    }
}

module.exports = SocketManager;