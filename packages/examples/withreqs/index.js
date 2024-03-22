//--web true
//--kind nodejs:default

const marked = require("marked")

function main(args) {
    let name = args.name || "world"
    let text = `# Welcome\n\nHello, ${name}.`
    return {
        body:  marked.parse(text)
    }
}

module.exports = main