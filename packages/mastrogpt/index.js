//--web true
//--kind nodejs:default

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
