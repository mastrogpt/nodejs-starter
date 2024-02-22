//--web true
//--docker ghcr.io/nuvolaris/runtime-nodejs-v21:3.1.0-mastrogpt.2402201748

const mustache = require('mustache.js');
const chess = require('chess.js');
const Chessboard = require('chessboardjs');
const fs = require('fs');

function render(src, args) {
    const fileContent = fs.readFileSync(src, 'utf8');
    return mustache.render(fileContent, args);
}

function board(args) {
    const fen = args['chess'];
    try {
        console.log(fen);
        const board = new chess.Chess(fen);
        const chessboard = Chessboard('myBoard');
        const data = { "html": chessboard.position(board.fen()) };
        const out = render("html.html", data);
        return out;
    } catch (e) {
        const data = { "title": "Bad Chess Position", "message": e.toString() };
        const out = render("message.html", data);
        console.error(e.stack);
        return out;
    }
}

function main(args) {
    let out = "";

    if ("html" in args) {
        out = render("html.html", args);
    } else if ("code" in args) {
        const data = {
            "code": args['code'],
            "language": args["language"] || "plain_text"
        };
        out = render("editor.html", data);
    } else if ("chess" in args) {
        out = board(args);
    } else if ("message" in args) {
        args["title"] = args["title"] || "Message";
        out = render("message.html", args);
    }

    const code = out !== "" ? 200 : 204;
    return {
        "body": out,
        "statusCode": code
    };
}
