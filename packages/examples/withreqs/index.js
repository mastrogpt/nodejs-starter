//--kind nodejs:default
//--web true

const marked = require("marked");

function main(args) {
    let text = `# Welcome\n\nHello, *world*.`
    return {
        body:  marked.parse(text)
    }
}

module.exports = main