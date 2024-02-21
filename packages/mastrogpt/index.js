//--web true
function main(arg) {
    const data = {
        "services": [
            {
                "name": "Demo",
                "url": "mastrogpt/demo",
            },
            {
                "name": "OpenAI",
                "url": "openai/chat"
            },
        ]
    };
    return { "body": data };
}
