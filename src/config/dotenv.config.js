const dotenv = require('dotenv');
const program = require('../utils/commander.js');

const { mode } = program.opts();




dotenv.config({
    path: mode === 'prod' ? './.env.prod' : './.env.dev'
});

const configObj = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    codeSession: process.env.codeSession,
    GITclientID: process.env.GITclientID,
    GITclientSecret: process.env.GITclientSecret,
    GITcallbackURL: process.env.GITcallbackURL,
    node_env: process.env.NODE_ENV
}

module.exports = configObj;