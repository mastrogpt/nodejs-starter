//--kind nodejs:default
//--param REDIS_URL $REDIS_URL
//--param REDIS_PREFIX $REDIS_PREFIX

async function main(args) {
    // connnect to the redis database
    const db = require("redis").createClient({"url":args.REDIS_URL})
    await db.connect()
    let p = args.REDIS_PREFIX
    // execute a ping command
    await db.set(p+"hello", "world")
    return db.get(p+"hello").then(r => ({
        "hello": r
    }))
}