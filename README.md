# Proyecto - Manejo de archivos con métodos asíncronos

Este proyecto corresponde a la implementación de un servidor con Express que gestiona productos mediante endpoints definidos. Se utilizó la clase `ProductManager` para la gestión de productos con persistencia de datos basada en archivos.

## Descripción del Proyecto

Se abordó la modificación de la persistencia de datos en memoria a una persistencia basada en archivos. Se trabajó sobre la clase `ProductManager`, permitiendo operaciones de buscado y filtrado de datos de productos en archivos.

## Funcionalidades Implementadas

### Endpoints

1. **Endpoint para Consultar Todos los Productos:**

   - Ruta: `/products`
   - Método: GET
   - Descripción: Este endpoint devuelve todos los productos almacenados en el archivo de productos.

2. **Endpoint para Consultar Productos con Límite:**

   - Ruta: `/products?limit={num}`
   - Método: GET
   - Descripción: Al recibir la consulta con un límite específico, este endpoint devuelve un número determinado de productos según el límite establecido.

3. **Endpoint para Consultar Producto por ID:**
   - Ruta: `/products/:pid`
   - Método: GET
   - Descripción: Recibe un ID de producto y devuelve únicamente el producto solicitado.
