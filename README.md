## Desafío Entregable 5

### Descripción

Este proyecto es una aplicación de backend desarrollada utilizando Node.js, Express y MongoDB. Proporciona una plataforma para gestionar productos, carritos y usuarios, incluyendo funcionalidades avanzadas como actualizaciones en tiempo real, filtrado, paginación, ordenamiento y autenticación de usuarios.

### Configuración del Proyecto

El proyecto ha sido configurado con éxito para integrar el motor de plantillas Handlebars y se ha instalado el servidor de Socket.io.

Se ha creado una instancia de Express y configurado Handlebars, proporcionando una base sólida para la aplicación.

```javascript
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());

//Configuramos handlebars:
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Routing
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
```

### Creación de Vistas Handlebars

Las vistas Handlebars, **home.handlebars** y **realTimeProducts.handlebars**, han sido creadas con éxito. La vista "home.handlebars" muestra una lista de todos los productos agregados hasta el momento.

### Actualización Automática con Websockets

Se ha implementado la funcionalidad de websockets para la vista **realTimeProducts.handlebars**. Cada vez que se agrega o elimina un producto, la vista se actualiza automáticamente, proporcionando una experiencia en tiempo real para los usuarios.

### Persistencia de Datos

- **Persistencia con Mongo:** Utilización de MongoDB como sistema de persistencia principal.
- **Endpoints definidos:** Todos los endpoints para trabajar con productos y carritos están definidos.
- **Optimización de consultas:** Se han implementado consultas eficientes para mejorar el rendimiento de la aplicación.
- **Seguridad:** Se han implementado medidas de seguridad para proteger la información sensible y garantizar la autenticación de usuarios.

---
