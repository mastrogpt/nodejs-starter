//--web true
//--kind nodejs:default
//--param MONGODB_URL $MONGODB_URL

const { MongoClient } = require('mongodb');

async function main(args) {
    console.log(args.mongodb_url)
    const client = new MongoClient(args.MONGODB_URL);
    await client.connect()
    console.log("client.connect() passed")
    const data = client.db().collection("data")
    await data.insertOne({ "hello": "world" })
    let res = []
    await data.find().forEach(x => res.push(x))
    await data.deleteMany({})
    return {
        "body": res
    }
}
