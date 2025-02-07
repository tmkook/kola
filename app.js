const koa = require('koa');
const config = require('./config');
const app = new koa(config.get('app.koa'));

//session
const session = require('koa-session');
app.use(session(config.get('app.session'), app));

//public
const serve = require('koa-static');
app.use(serve(process.cwd() + '/public'));

//bodyparser
const bodyparser = require('koa-bodyparser');
app.use(bodyparser());

module.exports = app;