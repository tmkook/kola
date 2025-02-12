const minify = require('@node-minify/core');
const jsengine = require('@node-minify/uglify-js');
const cssengine = require('@node-minify/clean-css');
const program = require('../command');
const config = require('../config');
const string = require('../string');

program.command('minify')
    .description('Minify js and css')
    .action(() => {
        let options = config.get('minify', []);
        for (let item of options) {
            let ext = string.last(item.input, '.');
            minify({
                compressor: ext == 'js' ? jsengine : cssengine,
                input: item.input,
                output: item.output,
                callback: function (err, min) {
                    if (err) {
                        console.log(err, min);
                    } else {
                        console.log(item.output + ' has been created.');
                    }
                }
            });
        }
    });