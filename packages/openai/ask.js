//--web true
//--kind nodejs:default
//--param OPENAI_API_KEY $OPENAI_API_KEY
//--param OPENAI_API_HOST $OPENAI_API_HOST

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

async function main(args) {
    const key = args.OPENAI_API_KEY || process.env.OPENAI_API_KEY
    const host = args.OPENAI_API_HOST || process.env.OPENAI_API_HOST
    const model = "gpt-35-turbo"
    const AI = new OpenAIClient(host, new AzureKeyCredential(key))
    const input = args.input || ""
    let output = "Please provide a parameter 'input'."
    if (input != "") {
        //const { id, created, choices, usage } =
        let request = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: input },
        ]
        let r = await AI.getChatCompletions(model, request);
        output = r.choices[0].message.content
    }

    return { body: output }
}