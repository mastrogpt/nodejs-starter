//--kind nodejs:default
//--web true

const hello = require("./hello")

function main(args) { 
    return { 
        body: hello()
    }
}

module.exports = main
