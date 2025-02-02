const string = require('./string');
const folder = require('./folder');

module.exports = new class dotenv {
    parse(file) {
        let content = folder.content(file);
        let data = string.str2map(content);
        for (let i in data) {
            process.env[i] = data[i];
        }
    }

    set(key, value) {
        process.env[key] = value + '';
    }

    get(key, defaults) {
        let data = process.env[key] ?? defaults;
        return string.parseStr(data);
    }
}