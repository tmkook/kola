const koarouter = require('koa-router');
const config = require('./config');
const folder = require('./folder');
let router = new koarouter(config.get('app.router'));

//controller
router.action = function (file, method) {
    let classname = require(folder.base('app/controllers/' + file));
    return async function (context) {
        let controller = new classname(context);
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
        return require(folder.base('app/middlewares/' + func));
    } else {
        return func;
    }
}

module.exports = router;