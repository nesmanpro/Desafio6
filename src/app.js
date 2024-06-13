import express from 'express';
import multer from 'multer';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';
import cors from 'cors';
import addLogger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import configObj from './config/dotenv.config.js';
import { createServer } from 'http';
import exphbs from 'express-handlebars';
import { dirname } from 'path';



// Utilidad para obtener el __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Variables de configuración
const { port, mongo_url, codeSession } = configObj;

// Inicializar la aplicación de Express
const app = express();
import './database.js';

//Handlebars
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(addLogger);

// // Middleware de multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './src/public/img')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })
// app.use(multer({ storage }).single('image'));

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
const httpServer = createServer(app);
httpServer.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

// Websocket

import SocketManager from './socket/SocketManager.js';
new SocketManager(httpServer);


// Importaciones para swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de la app Tienda Supermercado',
            description: 'API para administrar tienda de productos, pudiendo crear usuarios para gestionar ventas y compras, con sus correspondientes carritos y ticket de compra'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]

};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));