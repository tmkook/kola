const { Model, SoftDeletes, compose } = require('sutando');

module.exports = class ____model____ extends compose(Model, SoftDeletes) {
    connection = 'default'
    // ...
}
