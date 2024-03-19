//--web true
//--kind nodejs:default

function main(args) {
  let name = args.name || "world"
  return { "body": "hello, "+name }
}
