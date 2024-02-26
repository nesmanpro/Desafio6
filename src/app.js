
// Declaramos puerto, llamamos express y creamos app y routes

const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const viewsRouter = require('./routes/views.routes');
const cookieParser = require('cookie-parser');
const socket = require('socket.io');
const messageModel = require('./dao/models/message.model.js');
require('./database.js');

//Handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));
app.use(cookieParser());




//Configuramos handlebars:
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views')


// Routing

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Iniciar el servidor
const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})

// *** Chat *** //
// socket.io

// Creamos instancia de socket.io

const io = new socket.Server(httpServer);


io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado!');

    socket.on('messages', async data => {

        // Guardar en mongo
        await messageModel.create(data);

        // Obtengo messages y madno a cliente
        const message = await messageModel.find();
        io.sockets.emit('messageLogs', message);


    })
})
