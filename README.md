# Gestión de Productos y Carritos con Node.js y Express (PreentregaPF 1)

Este proyecto tiene como objetivo crear un servidor utilizando Node.js y Express que gestione dos grupos de rutas: `/products` y `/carts`. Las rutas se definen de la siguiente manera:

## Rutas para Productos (/api/products)

- **GET /:** Retorna todos los productos almacenados.
- **GET /:pid:** Retorna el producto específico con el id proporcionado.
- **POST /:** Agrega un nuevo producto con los siguientes campos obligatorios:
  - id (autogenerado)
  - title
  - description
  - code
  - price
  - status (true por defecto)
  - stock
  - category
  - thumbnails (Array de rutas de imágenes)
- **PUT /:pid:** Actualiza un producto basado en los campos proporcionados en el cuerpo de la solicitud.
- **DELETE /:pid:** Elimina el producto con el id especificado.

## Rutas para Carritos (/api/carts)

- **POST /:** Crea un nuevo carrito con un id único y un array vacío de productos.
- **GET /:cid:** Lista los productos pertenecientes al carrito con el id especificado.
- **POST /:cid/product/:pid:** Agrega un producto al carrito específico. El cuerpo de la solicitud debe incluir el id del producto y la cantidad a agregar.

### Persistencia de la Información

La información se almacena utilizando el sistema de archivos, con los archivos "productos.json" y "carrito.json" para respaldar la información de productos y carritos, respectivamente.

---
