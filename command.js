const { program } = require('commander');
const dotenv = require('./dotenv');
const config = require('./config');
const folder = require('./folder');

dotenv.parse(folder.base('.env'));
config.add(folder.imports(folder.base('config')));

program.loader = function () {
    folder.imports(folder.root('commands'));
    folder.imports(folder.base('provider/commands'));
    return program;
}

module.exports = program;