const folder = require('../folder');
const program = require('../command');

program.command('public')
    .description('public symlink')
    .action(() => {
        folder.fs.cpSync(folder.base('resource/assets'), folder.base('public/assets'), { recursive: true, dereference: true });
        if (!folder.fs.existsSync(folder.base('public/uploads'))) {
            folder.fs.symlinkSync(folder.base('storage/uploads'), folder.base('public/uploads'), 'dir');
        }
        console.log('public successfull');
    });