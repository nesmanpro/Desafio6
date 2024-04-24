const express = require('express');
const multer = require('multer');
const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const viewsRouter = require('./routes/views.routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/user.routes.js');
const sessionRoutes = require('./routes/session.routes.js');
const cors = require("cors");
const addLogger = require('./utils/logger.js')



//Passport importacion
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');

// importacion dotenv.config
const configObj = require('./config/dotenv.config.js');
const { port, mongo_url, codeSession } = configObj;


const app = express();
require('./database.js');

//Handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        renderPartial: function (header, context) {
            return hbs.handlebars.partials[header](context);
        }
    }
});



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));
app.use(cors());
app.use(addLogger);

// Middleware de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
app.use(multer({ storage }).single('image'));

// Cookie Parser
app.use(cookieParser());

// Sessions
app.use(session({
    secret: codeSession,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: mongo_url,
        ttl: 90
    }),
}))

// Passport configuracion
app.use(passport.initialize());
app.use(passport.session());
initializePassport();


//Configuramos handlebars:
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views')


// Routing
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/', viewsRouter);



// Iniciar el servidor
const httpServer = app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})


// Websocket

const SocketManager = require('./socket/SocketManager.js');
new SocketManager(httpServer);

