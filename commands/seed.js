const folder = require('../folder');
const program = require('../program');

program.command('seed')
    .description('Seeder executes')
    .argument('[string]', 'Only the File')
    .action(async (file) => {
        let files = file ? { file: require(file) } : folder.imports(folder.base('resource/seeders'));
        for (let i in files) {
            let item = new (files[i]);
            await item.seeder();
            console.log('seeder: ' + i + ' has been executed');
        }
    });