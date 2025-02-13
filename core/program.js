const { program } = require('commander');
const dotenv = require('./dotenv');
const config = require('./config');
const folder = require('./folder');

dotenv.parse(folder.content(folder.base('.env')));
config.add(folder.imports(folder.base('config')));
folder.imports(folder.base('provider/bootstraps'))
folder.imports(folder.base('routes'));

program.loader = function () {
    folder.imports(folder.root('commands'));
    folder.imports(folder.base('provider/commands'));
    return program;
}

module.exports = program;