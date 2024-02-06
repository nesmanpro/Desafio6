
// Declaramos puerto, llamamos express y creamos app y routes

const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const viewsRouter = require('./routes/views.routes');
const socket = require('socket.io');
//importamos handlebars
const exphbs = require('express-handlebars');
require('./database.js');



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));



//Configuramos handlebars:
app.engine('handlebars', exphbs.engine());
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
const message = [];


io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado!');

    socket.on('message', data => {
        message.push(data);
        io.emit('messageLogs', message)

    })
})
