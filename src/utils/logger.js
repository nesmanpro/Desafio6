const winston = require('winston');
const configObj = require('../config/dotenv.config.js');
const { node_env } = configObj;

const levels = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colours: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
};

// Logger development



const devLogger = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levels.colours }),
                winston.format.simple()
            )
        })
    ]
})


//Looger production

const prodLogger = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.simple()
            )
        })
    ]
})

// ternario con las opciones
const logger = node_env === 'dev' ? devLogger : prodLogger;

// middleware
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}


module.exports = addLogger;