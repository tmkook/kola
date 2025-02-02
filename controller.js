const view = require('./view');
module.exports = class controller {
    view = null;
    context = null;
    constructor(context) {
        this.view = view;
        this.context = context;
    }
}