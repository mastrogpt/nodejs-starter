//--web true
//--docker ghcr.io/nuvolaris/runtime-nodejs-v21:3.1.0-mastrogpt.2402201748

const chat = require("./chat");

function main(args) {
    return chat(args)
}
