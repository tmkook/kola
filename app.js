const koa = require('koa');
const session = require('koa-session');
const config = require('./config');
const app = new koa(config.get('app.koa'));
app.use(session(config.get('app.session'), app));
module.exports = app;