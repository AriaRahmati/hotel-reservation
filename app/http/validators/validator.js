const autobind = require('auto-bind')

class Validator{
    constructor(){
        autobind(this)
    }
}

module.exports = Validator;