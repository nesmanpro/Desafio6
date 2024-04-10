const mongoose = require('mongoose');
const configObj = require('./config/dotenv.config.js');
const { mongo_url } = configObj;

// mongoose.connect(mongo_url)
//     .then(() => console.log('Enhorabuena!! Conexion establecida!'))
//     .catch(() => console.log('Lo sentimos! Ha habido algun error con el servidor mongoDB'))


class DataBase {
    static #request;

    constructor() {
        mongoose.connect(mongo_url);
    }

    static getRequest() {
        if (this.#request) {
            console.log('Already connected!');
            return this.#request;
        }

        this.#request = new DataBase();
        console.log('New connection succesful!!');
        return this.#request;
    }
}

module.exports = DataBase.getRequest();
