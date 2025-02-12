const folder = require('../folder');
const program = require('../command');

program.command('public')
    .description('public symlink')
    .action(() => {
        folder.fs.cpSync(folder.base('resource/statics'), folder.base('storage/statics'), { recursive: true, dereference: true });
        folder.fs.symlinkSync(folder.base('storage/statics'), folder.base('public'), 'dir');
        folder.fs.symlinkSync(folder.base('storage/uploads'), folder.base('public'), 'dir');
        console.log('public successfull');
    });