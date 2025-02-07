const controller = require('kola/controller');
const view = require('kola/view');

module.exports = class ____controller____ extends controller {
    index() {
        return view.file('welcome');
    }
}