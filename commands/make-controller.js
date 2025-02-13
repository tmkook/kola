const folder = require('../core/folder');
const program = require('../core/program');

program.command('make:controller')
    .description('Create a Controller')
    .argument('<string>', 'Controller Name')
    .action((arg) => {
        //get table name
        let name = arg.toLowerCase();
        let target = folder.base('app/controllers/' + name + '.js');
        if (!folder.fs.existsSync(target)) {
            let stubfc = folder.root('commands/make-stubs/controller.js');
            folder.stub(target, stubfc, { controller: name });
            console.log(name + ' controller has been generated');
        } else {
            console.log(name + ' controller already exists.');
        }
    });