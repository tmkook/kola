const folder = require('../folder');
const string = require('../string');
const program = require('../command');

async function up(step) {
    let logfile = folder.base('storage/sqlites/migrations.json');
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

async function down(step) {
    let logfile = folder.base('storage/sqlites/migrations.json');
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
    .action((type, step) => {
        switch (type) {
            case 'up':
                up(step);
                break;
            case 'down':
                down(step);
                break;
            default:
                program.error('invalid type');
        }
    });