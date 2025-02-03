const folder = require('../folder');
const program = require('../command');

program.command('make:model')
    .description('Create a Model')
    .argument('<string>', 'Model File Name')
    .option('-m, --migrate', 'Create Migration Together')
    .action((arg, options) => {
        let name = arg.toLowerCase();
        let stubfc = folder.root('commands/make-stubs/model.js');
        let target = folder.base('app/models/' + name + '.js');
        folder.stub(target, stubfc, { model: name });
        if (options.migrate) {
            program.parse(['make:migration', name], { from: 'user' });
        }
    });