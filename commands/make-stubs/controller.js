const { controller, view } = require('kola');

module.exports = class ____controller____ extends controller {
    index() {
        return view.file('welcome');
    }
}