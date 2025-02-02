const secret = require('./secret');

module.exports = class auth {
    _model = null;
    _context = null;
    _logged = false;
    _options = {
        primary_key: 'id',
        cookie_path: '/',
        cookie_exp: 3600,
        cookie_name: 'token',
        signed_key: process.env.APP_KEY,
    }

    constructor(context, options) {
        thihs.context = context;
        if (options) {
            this._options = Object.assign(this._options, options);
        }
    }

    /**
     * 设置登录
     * @param {string} user 
     * @param {bool} remember 
     */
    login(user, remember = false) {
        if (user[this._options.primary_key]) {
            this._logged = user;
            this._model = user.getModel();
            let exp = remember ? 86400 * 365 : this._options.cookie_exp;
            let sign = new secret(this._options.signed_key);
            let value = sign.encode(user + '', exp);
            this._context.cookies.set(this._options.cookie_name, value, { signed: true, path: this._options.cookie_path, maxAge: Date.now() + exp * 1000 });
        } else {
            throw new Error("The user object must have a primary key");
        }
    }

    /**
    * 清除登录
    */
    logout() {
        this._context.cookies.set(this._options.cookie_name, '', { maxAge: 0, expires: 0, overwrite: true });
        this._context.cookies.set(this._options.cookie_name + '.sig', '', { maxAge: 0, expires: 0, overwrite: true });
    }

    /**
     * 解析
     * @param {object} context 
     */
    parse() {
        let value = this._context.cookies.get(this._options.cookie_name, { signed: true });
        if (value) {
            let sign = new secret(this._options.signed_key);
            let data = sign.decode(value);
            //renewal token
            if (data) {
                let exp = data.exp;
                let now = parseInt(Date.now() / 1000);
                if (now - data.est > exp * 0.5) {
                    let encode = sign.encode(data.data, exp);
                    this._context.cookies.set(this._options.cookie_name, encode, { signed: true, path: this._options.cookie_path, maxAge: Date.now() + exp * 1000 });
                }
            }
            return data;
        }
        return null;
    }

    /**
     * 检查登录
     */
    access(next) {
        if (!this.parse()) {
            this._context.throw(402, "Not Logged In");
        }
        return next && next();
    }

    /**
     * 获取登录的用户
     */
    async user() {
        if (this.logged === false) {
            let data = this.parse();
            if (data) {
                this.logged = await this._model.query().where(this._options.primary_key, data.data).first();
            }
        }
        return Promise.resolve(this.logged);
    }
}