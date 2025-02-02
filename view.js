const ejs = require('ejs');
const folder = require('./folder');

module.exports = new class response {
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
        let file = folder.content(folder.base('app/views/' + view + '.html'));
        let html = ejs.render(file, data, config);
        return { type: "text/html", body: html };
    }

    success(data, code = 200) {
        return this.json({ status: true, code: code, data: data });
    }

    error(message, code = 500) {
        return this.json({ status: false, code: code, message: message });
    }
}