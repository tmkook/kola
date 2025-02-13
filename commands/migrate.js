const folder = require('../core/folder');
const string = require('../core/string');
const program = require('../core/program');

async function up(step, logfile) {
    let executed = JSON.parse(folder.content(logfile, '{}'));
    let files = folder.imports(folder.base('resource/migrations'));
    let keys = Object.keys(files);
    let vals = Object.values(files);
    step = step == 'all' ? keys.length : parseInt(step);
    for (let i = 0; i < step; i++) {
        if (!executed[keys[i]]) {
            executed[keys[i]] = string.timestamp();
            let migrate = new vals[i];
            await migrate.up();
            console.log(keys[i] + ' done');
        }
    }
    folder.fs.writeFileSync(logfile, JSON.stringify(executed));
    console.log('migration up steps: ' + step + ' all executed.');
    process.exit(1);
}

async function down(step, logfile) {
    let executed = JSON.parse(folder.content(logfile, '{}'));
    let files = folder.imports(folder.base('resource/migrations'));
    let keys = Object.keys(files);
    let vals = Object.values(files).reverse();
    step = step == 'all' ? keys.length : parseInt(step);
    for (let i = 0; i < step; i++) {
        if (executed[keys[i]]) {
            delete executed[keys[i]];
            let migrate = new vals[i];
            await migrate.down();
            console.log(keys[i] + ' done');
        }
    }
    folder.fs.writeFileSync(logfile, JSON.stringify(executed));
    console.log('migration up steps: ' + step + ' all executed.');
    process.exit(1);
}

program.command('migrate')
    .description('Migration runner')
    .argument('<string>', 'up down')
    .argument('[number]', 'Run Steps', 1)
    .option('-r, --reset', 'Reset migration histories')
    .action((type, step, options) => {
        let logfile = folder.base('storage/sqlites/migrations.json');
        if (options.reset) {
            folder.fs.writeFileSync(logfile, '');
        }
        switch (type) {
            case 'up':
                up(step, logfile);
                break;
            case 'down':
                down(step, logfile);
                break;
            default:
                program.error('invalid type');
        }
    });