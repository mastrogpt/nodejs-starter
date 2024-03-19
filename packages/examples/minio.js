//--web true
//--kind nodejs:default
//--param MINIO_HOST $MINIO_HOST
//--param MINIO_PORT $MINIO_PORT
//--param MINIO_ACCESS_KEY $MINIO_ACCESS_KEY
//--param MINIO_SECRET_KEY $MINIO_SECRET_KEY
//--param MINIO_DATA_BUCKET $MINIO_DATA_BUCKET

const Minio = require('minio');

async function main(args) {        
    console.log(`connecting to ${args.MINIO_HOST}:${args.MINIO_PORT}`)
    let minioClient = new Minio.Client({
        endPoint: args.MINIO_HOST,
        port: parseInt(args.MINIO_PORT),
        useSSL: false,
        accessKey: args.MINIO_ACCESS_KEY,
        secretKey: args.MINIO_SECRET_KEY
    });

    let response = {};
    let bucketName = args.MINIO_DATA_BUCKET;

    let bucketExists = await minioClient.bucketExists(bucketName);

    if(!bucketExists) {       
        response.bucketOperation = await  minioClient.makeBucket(bucketName, 'us-east-1');
    }

    response.buckets = await minioClient.listBuckets();
    return {
        "body": response
    }
}
