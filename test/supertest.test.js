import mongoose from "mongoose";
import supertest from "supertest";
import { expect } from "chai";
import UserModel from '../src/models/user.model.js';
import prodModel from "../src/models/products.model.js";
import cartModel from "../src/models/cart.model.js";
import configObj from "../src/config/dotenv.config.js";




const { port, mongo_url } = configObj;
const requester = supertest(`http://localhost:${port}`);







describe('Testing App Supermercado', () => {
    // Datos userMock
    const testEmail = 'test@testing.com';
    const testPassword = '1234';
    const newTestPassword = 'new1234';
    const userMock = {
        first_name: 'Juan',
        last_name: 'Román',
        email: testEmail,
        password: testPassword,
        age: 30,
        role: 'admin'
    };


    async function getUserId(email) {
        let userTest = await UserModel.findOne({ email: email });
        if (!userTest) {
            console.log('Usuario no encontrado');
            throw new Error('Usuario no encontrado');
        }
        return userTest
    }

    before(async function () {
        this.timeout(10000);
        await mongoose.connect(mongo_url, {
            serverSelectionTimeoutMS: 5000
        });
        await mongoose.connection.db.collection('users').deleteOne({ email: testEmail });

    });

    after(async function () {
        await mongoose.connection.db.collection('users').deleteOne({ email: 'admin@testing.com' });
        const userMock2 = await getUserId('test@testing.com');
        const cartId = userMock2.cart;
        await mongoose.connection.db.collection('carts').deleteOne({ _id: cartId });

        await mongoose.connection.close();
    });


    describe('Testing User/Session Routes', () => {
        it('Test 1 - Endpoint POST api/users/register | Debería crear un nuevo usuario y redirigir a /products', async () => {


            const { statusCode } = await requester.post("/api/users/register").send(userMock);

            // Consultamos la base de datos para verificar si el usuario se creó correctamente
            const user = await UserModel.findOne({ email: testEmail });

            // Verificamos que la pagina redirige correctamente, que el usuario se haya creado y tenga un _id
            expect(statusCode).to.be.eql(302)
            expect(user).to.exist;
            expect(user).to.have.property('_id');
        });


        it('Test 2 - Debería solicitar el restablecimiento de contraseña y generar un token', async () => {
            const { status, header } = await requester.post("/api/sessions/resetPassword").send({ email: testEmail });

            // Verificar la redirección
            expect(status).to.eql(302);
            expect(header.location).to.eql('/confirmationSent');

            // Verificar que el token se ha guardado en la base de datos
            const user = await UserModel.findOne({ email: testEmail });
            expect(user.resetToken).to.exist;
            expect(user.resetToken.token).to.be.a('string');
            expect(user.resetToken.expiresAt).to.be.a('date');
        });


        it('Test 3 - Debería restablecer la contraseña del usuario con un token válido', async () => {
            // Obtener el usuario y generar un token
            const user = await UserModel.findOne({ email: testEmail });
            const token = user.resetToken.token

            // Realizar solicitud para restablecer la contraseña
            const { status, header } = await requester.post("/api/sessions/changePassword").send({ email: testEmail, password: newTestPassword, token: token });

            // Verificar la redirección
            expect(status).to.equal(302);
            expect(header.location).to.eql('/login');

            // Verificar que la contraseña se ha actualizado y el token se ha eliminado
            const updatedUser = await UserModel.findOne({ email: testEmail });
            expect(updatedUser).to.exist;
            // Contraseña debe ser diferente
            expect(updatedUser.password).to.not.eql(testPassword);
            // Token debe estar eliminado
            expect(updatedUser.resetToken.token).to.be.undefined;

        });
    });


    describe('Testing Products Routes', () => {

        const productMock = {
            title: 'Producto de prueba',
            description: 'Descripción del producto de prueba',
            price: 100,
            code: 'test123',
            stock: 10,
            category: 'test'
        };


        it('Test 1 - Debería agregar un producto como administrador', async () => {


            // engaño al middleware isAdmin seteando el referer del header, asi pasa como lo hace el de swagger
            const { status } = await requester.post('/api/products').set('referer', 'http://localhost:8080/apidocs/').send(productMock);

            // Verificar que el producto se agregó correctamente
            expect(status).to.eql(201);

            // Verificar que el producto está en la base de datos
            const product = await prodModel.findOne({ code: 'test123' });

            expect(product).to.exist;
            expect(product).to.have.property('_id');

        });


        it('Test 2 - Debería obtener un producto por su ID', async () => {

            const product = await prodModel.findOne({ code: 'test123' });
            const { status, body } = await requester.get(`/api/products/${product._id}`);

            // Verificar que el producto se obtuvo correctamente
            expect(status).to.eql(200);
            expect(body).to.have.property('_id', product._id.toString());
        });


        it('Test 3 - Debería eliminar un producto como administrador', async () => {
            const product = await prodModel.findOne({ code: 'test123' });
            const { status } = await requester.delete(`/api/products/${product._id}`).set('referer', 'http://localhost:8080/apidocs/');

            // Verificar que el producto se eliminó correctamente
            expect(status).to.eql(200);

            // Verificar que el producto ya no está en la base de datos
            const deletedProduct = await prodModel.findById(product._id);
            expect(deletedProduct).to.be.null;
        });

    });




    describe('Cart Routes', () => {





        it('Test 1 - Debería agregar un producto al carrito', async () => {
            // Creamos o importamos los parametros que vamos a utilizar
            const userMock2 = await getUserId('test@testing.com');
            const cartId = userMock2.cart;
            const prodId = '65c1638618bf0c7f6caef7de';

            // hacemos la peticion POST, forzando con el set saltar el middleware
            const { statusCode } = await requester.post(`/api/carts/${cartId}/product/${prodId}`).set('referer', 'http://localhost:8080/apidocs/').send({ quantity: 1 });


            // extraemios el id del producto del carrito y lo pasamos a string
            const cart = await cartModel.findById(cartId);
            const productIdFromCart = cart.products[0].product._id.toString();


            // verificamos y comparamos
            expect(cart.products).to.have.lengthOf(1);
            expect(cart.products[0].quantity).to.eql(1);
            expect(productIdFromCart).to.eql(prodId);

        });


        it('Test 2 - Debería actualizar la cantidad de un producto en el carrito', async () => {
            const userMock = await getUserId('test@testing.com');
            const cartId = userMock.cart;
            const prodId = '65c1638618bf0c7f6caef7de';
            const newQuantity = 3;

            // Actualiza la cantidad del producto en el carrito
            const { statusCode, body } = await requester.put(`/api/carts/${cartId}/product/${prodId}`).set('referer', 'http://localhost:8080/apidocs/').send({ quantity: newQuantity });

            // Verifica que la respuesta sea correcta
            expect(statusCode).to.equal(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('message', 'Cantidad del producto actualizada correctamente');
            expect(body.updatedCart).to.be.an('object');

            // Verifica que la cantidad del producto en el carrito se haya actualizado correctamente
            const updatedCart = await cartModel.findById(cartId).populate('products.product');
            const updatedProduct = updatedCart.products.find(product => product.product._id.toString() === prodId);
            expect(updatedProduct.quantity).to.equal(newQuantity);
        });

        it('Test 3 - Debería vaciar el carrito', async () => {

            // Creamos o importamos los parametros que vamos a utilizar
            const userMock2 = await getUserId('test@testing.com');
            const cartId = userMock2.cart;

            await requester.delete(`/api/carts/${cartId}`);

            // Verificar que el carrito esté vacío
            const cart = await cartModel.findById(cartId);
            expect(cart.products).to.be.an('array').that.is.empty;
        });
    })
});
