# node
npm install --save openai
npm install --save @azure/openai
source ../../.env
export OPENAI_API_KEY OPENAI_API_HOST
node
args = {"input": "What is the capital of Italy", "OPENAI_API_HOST": "https://openai.sciabarra.net:8443/", "OPENAI_API_KEY": "1836cb99-07ac-49fd-9615-e459132c1f9d"}

args = {"input": "What is the capital of Italy", "OPENAI_API_HOST": "https://mastrogpt.openai.azure.com/", "OPENAI_API_KEY": "08f043499272496a98d421327e71f480"}

args

# python
task cli
args["OPENAI_API_HOST"] = "https://openai.sciabarra.net:8443"
