const ejs = require('ejs');
const folder = require('./folder');

module.exports = new class view {
    ejs = ejs;
    json(data) {
        return { type: "application/json", body: data };
    }

    file(file, data, options) {
        let config = {
            cache: true,
            filename: file
        };
        if (options) {
            config = Object.assign(config, options);
        }
        let content = folder.content(folder.base('app/views/' + file + '.html'));
        let html = ejs.render(content, data, config);
        return { type: "text/html", body: html };
    }

    success(data, code = 200) {
        return this.json({ status: true, code: code, data: data });
    }

    error(message, code = 500) {
        return this.json({ status: false, code: code, message: message });
    }
}