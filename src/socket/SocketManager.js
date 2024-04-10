const socket = require('socket.io');
const messageModel = require("../models/message.model.js");
// const ProductRepository = require("../repositories/product.repository.js");
// const productRepository = new ProductRepository();

class SocketManager {

    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("A client has connected");

            // socket.emit("productos", await productRepository.obtenerProductos() );

            // socket.on("eliminarProducto", async (id) => {
            //     await productRepository.eliminarProducto(id);
            //     this.emitUpdatedProducts(socket);
            // });

            // socket.on("agregarProducto", async (producto) => {
            //     await productRepository.agregarProducto(producto);
            //     this.emitUpdatedProducts(socket);
            // });

            socket.on('messages', async (data) => {
                await messageModel.create(data);
                const messages = await messageModel.find();
                socket.emit('messages', messages);
            });
        });
    }

    // async emitUpdatedProducts(socket) {
    //     socket.emit("products", await productRepository.getProduct());
    // }
}

module.exports = SocketManager;