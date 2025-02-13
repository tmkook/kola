const folder = require('../core/folder');
const string = require('../core/string');
const program = require('../core/program');

program.command('make:migration')
    .description('Create a Migration')
    .argument('<string>', 'Table name')
    .action((arg) => {
        //get table name
        let name = arg.toLowerCase();
        let modelfile = folder.base('app/models/' + name + '.js');
        if (folder.fs.existsSync(modelfile)) {
            let model = require(modelfile);
            name = model.init().getTable();
        }

        //build
        let time = string.datetime('ymdhis');
        let stubfc = folder.root('commands/make-stubs/migration.js');
        let target = folder.base('resource/migrations/' + time + '_table_' + name + '.js');
        folder.stub(target, stubfc, { table: name });
    });