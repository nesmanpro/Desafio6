## Desafío Entregable 4 - Handlebars & Websockets

### Configuración del Proyecto

El proyecto ha sido configurado con éxito para integrar el motor de plantillas Handlebars y se ha instalado el servidor de Socket.io.

Se ha creado una instancia de Express y configurado Handlebars, proporcionando una base sólida para la aplicación.

```javascript
const express = require("express");
const app = express();
const PORT = 8080;
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const viewsRouter = require("./routes/views.routes");
const exphbs = require("express-handlebars");
```

### Creación de Vistas Handlebars

Las vistas Handlebars, **home.handlebars** y **realTimeProducts.handlebars**, han sido creadas con éxito. La vista "home.handlebars" muestra una lista de todos los productos agregados hasta el momento.

### Actualización Automática con Websockets

Se ha implementado la funcionalidad de websockets para la vista **realTimeProducts.handlebars**. Cada vez que se agrega o elimina un producto, la vista se actualiza automáticamente, proporcionando una experiencia en tiempo real para los usuarios.

### Sugerencias

Para mejorar la interactividad, se ha incorporado un formulario en la vista **realTimeProducts.handlebars**. Este formulario utiliza websockets para enviar contenido, permitiendo la creación y eliminación de productos de manera eficiente.

---
