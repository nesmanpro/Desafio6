const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const configObj = require('../src/config/dotenv.config.js');
const { port, mongo_url } = configObj;
const User = require('../src/models/user.model.js');
const app = require('../src/app');

const requester = supertest(`http://localhost:${port}`);

describe('Testing App Supermercado', () => {


    // Genero un email generico para las pruebas
    const testEmail = 'test@testing.com';


    before(async function () {
        this.timeout(10000);



        await mongoose.connect(mongo_url, {
            serverSelectionTimeoutMS: 10000
        });


        await mongoose.connection.db.collection('users').deleteOne({ email: testEmail });
    });




    describe('Testing User', () => {
        it('Test 1 - Endpoint POST api/users/resgister | Debería crear un nuevo usuario', async () => {
            // Creamos un mock para una mascota

            const userMock = {
                first_name: 'Juan',
                last_name: 'Román',
                email: testEmail,
                password: '1234',
                age: 30
            }

            const { statusCode, ok, body } = await requester.post("/api/users/register").send(userMock);

            console.log(`Status Code: ${statusCode}`);
            console.log(`OK: ${ok}`);
            console.log(`Body: ${body}`);

            // Consultamos la base de datos para verificar si el usuario se creó correctamente
            const user = await User.findOne({ email: testEmail });

            // Verificamos que el usuario se haya creado y tenga un _id
            expect(user).to.exist;
            expect(user).to.have.property('_id');
        })
    })



    after(async function () {
        await mongoose.connection.close();
    });
})