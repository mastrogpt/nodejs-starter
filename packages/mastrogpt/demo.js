//--web true
//--kind nodejs:default

function main(args) {
    let language = null;
    let code = null;
    let chess = null;
    let message = null;
    let html = null;

    // initialize state
    let title = "MastroGPT Demo";
    let counter = 1;

    try {
        // get the state if available
        counter = parseInt(args.state) + 1;
    } catch {
        // initialize the state
        counter = 1;
    }

    message = `You made ${counter} requests`;
    const state = counter.toString();

    const input = args.input || "";
    console.log(`input='${input}'`);

    if (input === "") {
        output = `Welcome, this is MastroGPT demo chat showing what it can display.
Please select: 'code', 'chess', 'html', 'message'. `;
        message = "Watch here for rich output.";
    } else if (input === "code") {
        code = `
function sum_to(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
`;
        language = "javascript";
        output = `Here is some JavaScript code.\n\`\`\`javascript\n${code}\n\`\`\``;
    } else if (input === "chess") {
        chess = "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2";
        output = `Check this chess position.\n\n${chess}`;
    } else if (input === "html") {
        html = `
<h1>Sample Form</h1>
<form action="/submit-your-form-endpoint" method="post">
    <div>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
    </div>
    <div>
        <button type="submit">Login</button>
    </div>
</form>
`;
        output = `Here is some HTML.\n\`\`\`html\n${html}\n\`\`\``;
    } else if (input === "message") {
        message = "This is the message.";
        title = "This is the title";
        output = "Here is a sample message.";
    } else {
        output = "No AI here, please type one of 'code', 'chess', 'html', 'message'";
    }

    const res = {
        output,
    };

    if (language) res.language = language;
    if (message) res.message = message;
    if (state) res.state = state;
    if (title) res.title = title;
    if (chess) res.chess = chess;
    if (code) res.code = code;
    if (html) res.html = html;

    return { body: res };
}
