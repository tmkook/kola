const folder = require('./folder');

module.exports = class cache {
    file = null;
    constructor(file) {
        file = file ?? 'store';
        this.file = folder.base('resource/caches/' + file + '.tmp');
    }

    all() {
        let content = folder.content(this.file);
        return content == '' ? {} : JSON.parse(content);
    }

    set(key, value, exp) {
        let cache = this.all();
        cache[key] = { value: value, exp: parseInt(exp ?? 0), est: parseInt(Date.now() / 1000) };
        folder.fs.writeFileSync(this.file, JSON.stringify(cache));
    }

    get(key) {
        let cache = this.all();
        let data = cache[key];
        if (data) {
            if (data.exp) {
                let now = parseInt(Date.now() / 1000);
                if (now - data.est < data.exp) {
                    return data.value;
                } else {
                    this.delete(key);
                }
            } else {
                return data.value;
            }
        }
        return null;
    }

    delete(key) {
        let cache = this.all();
        delete cache[key];
        folder.fs.writeFileSync(this.file, JSON.stringify(cache));
    }

    clean() {
        folder.fs.unlinkSync(this.file);
    }
}