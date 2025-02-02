const koa = require('koa');
const koarouter = require('koa-router');
const folder = require('./folder');
let applications = {};

module.exports = new class app {

    get(key = 'app') {
        if (!applications[key]) {
            let opts = config.get(key);
            let app = new koa({ env: opts.env, keys: opts.keys, proxy: opts.proxy, subdomainOffset: opts.subdomainOffset, proxyIpHeader: opts.proxyIpHeader, maxIpsCount: opts.maxIpsCount });
            let router = new koarouter({ host: opts.host, prefix: opts.prefix, exclusive: opts.exclusive });

            //controller
            router.action = function (file, method) {
                let file = require(folder.base(key + '/controllers/' + file));
                return async function (context) {
                    let controller = new file(context);
                    let action = controller[method ?? 'index'];
                    if (action) {
                        let response = await action(context);
                        if (response && response.body) {
                            for (let i in response) {
                                context.response[i] = response[i];
                            }
                        } else {
                            context.tyep = 'text/plain';
                            context.body = response ?? '';
                        }
                    } else {
                        context.throw(404);
                    }
                }
            }
            //middleware
            router.next = function (func) {
                if (typeof (func) == 'string') {
                    return require(folder.base('provider/middlewares/' + func));
                } else {
                    return func;
                }
            }

            //bootstraps
            app.router = router;
            app.opts = opts;
            for (let i in opts.bootstraps) {
                let item = require(folder.base('resource/bootstraps/' + opts.bootstrap[i]));
                item && item(app);
            }

            applications[key] = app;
        }
        return applications[key];
    }

    listen(callback) {
        for (let i in applications) {
            this.single(callback, i);
        }
    }

    single(callback, key = 'app') {
        let app = applications[key];
        callback && callback(app);
        app.use(app.router.routes()).use(app.router.allowedMethods());
        app.listen(app.opts.port, function () {
            console.log('serve:' + app.opts.protocol + '://' + app.opts.host + ':' + app.opts.port);
        });
    }
}