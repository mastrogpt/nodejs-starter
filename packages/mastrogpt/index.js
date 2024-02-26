//--web true
//--docker ghcr.io/nuvolaris/runtime-nodejs-v21:3.1.0-mastrogpt.2402201748


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
