#--web true
import json

def main(_):
    data = {
        "services": [
            {
                "name": "Ambra",
                "url": "openai/ambra"
            },
            {
                "name": "OpenAI",
                "url": "openai/chat"
            },
            { 
                "name": "Demo", 
                "url": "mastrogpt/demo",
            } 
        ]
    }
    return {"body": data}
