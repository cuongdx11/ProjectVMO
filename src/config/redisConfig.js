const redis = require('redis')

const client =  redis.createClient()

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async() =>{
    await client.connect();
    console.log("Redis ket noi thanh cong")
}

connectRedis()
module.exports = client