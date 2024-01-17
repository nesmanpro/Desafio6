
// Declaramos puerto, llamamos express y creamos app y routes

const express = require('express');
const app = express();
const PORT = 8080;
const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const viewsRouter = require('./routes/views.routes');
//importamos handlebars
const exphbs = require('express-handlebars');



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


// ****** SOCKET ******

// Obtendo los productos
const ProductManager = require('./controllers/ProductManager');
const prodManager = new ProductManager('src/models/products.json');


//Importamos y configuramos socket.io
const socket = require('socket.io');
const io = socket(httpServer);

io.on('connection', async (socket) => {
    console.log('Un cliente se conectó!')
    socket.on('msn', (data) => {
        console.log(data)
        io.sockets.emit('msn', data)
    })

    // Ahora el servidor va a enviar productos 
    const allProds = await prodManager.getProducts();
    socket.emit('products', allProds)

    //recibir productos eliminados del cliente

    socket.on('deleteProd', async (id) => {
        await prodManager.deleteProduct(id);
        //Enviamos array prods actualizado
        io.socket.emit('products', allProds)
    })

    //Recibimos el prod agregado del cliente
    socket.on('addProd', async (prod) => {
        await prodManager.addProduct(prod)
        //Enviamos array prods actualizado 
        io.socket.emit('products', allProds)
    })
})





