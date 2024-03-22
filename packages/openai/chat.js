//--web true
//--kind nodejs:default
//--param OPENAI_API_KEY $OPENAI_API_KEY
//--param OPENAI_API_HOST $OPENAI_API_HOST

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const ROLE = `
When requested to write code, pick Javascript.
When requested to show chess position, always use the FEN notation.
When showing HTML, always include what is in the body tag,
but exclude the code surrounding the actual content.
So exclude always BODY, HEAD and HTML .
`;

const MODEL = "gpt-35-turbo";
let AI = null;

function req(msg) {
    return [
        { "role": "system", "content": ROLE },
        { "role": "user", "content": msg }
    ];
}

async function ask(input) {
    const comp = await AI.getChatCompletions(MODEL, req(input));
    if (comp.choices.length > 0) {
        const content = comp.choices[0].message.content;
        return content;
    }
    return "ERROR";
}

function extract(text) {
    const res = {};
    // search for a chess position
    const chessPattern = /(([rnbqkpRNBQKP1-8]{1,8}\/){7}[rnbqkpRNBQKP1-8]{1,8} [bw] (-|K?Q?k?q?) (-|[a-h][36]) \d+ \d+)/g;
    const chessMatches = text.match(chessPattern);
    if (chessMatches && chessMatches.length > 0) {
        res['chess'] = chessMatches[0];
        return res;
    }

    // search for code
    const codePattern = /```(\w+)\n(.*?)```/gs;
    const codeMatches = [...text.matchAll(codePattern)];
    if (codeMatches && codeMatches.length > 0) {
        const match = codeMatches[0];
        if (match[1] === "html") {
            let html = match[2];
            // extract the body if any
            const bodyPattern = /<body.*?>(.*?)<\/body>/gs;
            const bodyMatch = html.match(bodyPattern);
            if (bodyMatch) {
                html = bodyMatch[0];
            }
            res['html'] = html;
            return res;
        }
        res['language'] = match[1];
        res['code'] = match[2];
        return res;
    }
    return res;
}

async function main(args) {

    const OPENAI_API_KEY = args.OPENAI_API_KEY || process.env.OPENAI_API_KEY
    const OPENAI_API_HOST = args.OPENAI_API_HOST || process.env.OPENAI_API_HOST
    AI = new OpenAIClient(OPENAI_API_HOST, new AzureKeyCredential(OPENAI_API_KEY))

    let res = {};
    let input = args.input || ""
    if (input != "") {
        const output = await ask(input);
        res = extract(output);
        res['output'] = output;
    } else {
        res = {
            "output": "Welcome to the OpenAI demo chat",
            "title": "OpenAI Chat",
            "message": "You can chat with OpenAI."
        }        
    }

    return { "body":res };
}

module.exports = main