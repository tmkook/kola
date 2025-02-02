const winston = require('winston');
const config = require('config');
let log = config.get('logger');

let transports = [new winston.transports.Console()];
for (let i in log.transports) {
    transports.push(new winston.transports.File(log.transports[i]));
}

const logger = winston.createLogger({
    level: log.level,
    silent: log.silent,
    format: winston.format.json(),
    transports: transports,
});

module.exports = logger;