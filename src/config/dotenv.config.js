const dotenv = require('dotenv');
const program = require('../utils/commander.js');

const { mode } = program.opts();




dotenv.config({
    path: mode === 'production' ? './.env.prod' : './.env.dev'
});

const configObj = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    GITclientID: process.env.GITclientID,
    GITclientSecret: process.env.GITclientSecret,
    GITcallbackURL: process.env.GITcallbackURL
}

module.exports = configObj;