const redis  = require('redis');
const client = redis.createClient();

class Redis {
    
    constructor() {
        this.is_redis_running = false
        this.cache_expiry     = 1 * 60 * 60; //1 HOUR
        this.client           = client;

        client.on('connect', () => {
            console.log('Redis client connected');
            this.is_redis_running = true;
            clearRedis();
        });
        client.on('error', (err) => {
            console.log('error in redis');
            this.is_redis_running = false;
        });

        function clearRedis() {
            client.flushall((err, res) => {
                console.log(err || res);
            });
        }
    }
}

module.exports = new Redis();