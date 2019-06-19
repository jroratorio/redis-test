const Events = require('../models/event');

const redis_connection = require('../config/redis');    

module.exports.add = async (req, res, next) => {

    let { client, is_redis_running } = redis_connection;  
    
    let { name, location, date, url } = req.body;

    try {

        const event_obj = {
            name,
            location,
            url,
            date
        };

        let _created = await Events.create(event_obj);

        if (is_redis_running) {
            //invalidate if any matching entries are there
            let _possible_keys = [
                {
                    date,
                    location
                }, {
                    date
                }, {
                    location
                }
            ];
            
            _possible_keys.map((elem) => {
                client.del(JSON.stringify(elem));
            });
        }

        return res.status(200).send(_created);

    } catch (err) {
        console.log(err);
        if (err.code === '11000') {
            return res.status(409).send({ message: 'Event names should be unique' });
        }
        return next(err);
    }
}

module.exports.search = async (req, res, next) => {
    
    let { client, cache_expiry, is_redis_running } = redis_connection;

    const { date, location } = req.query;
    
    const find_predicate = {};

    if (date) {        
        find_predicate.date = new Date(date);
    }

    if (location) {
        find_predicate.location = location;
    }

    try {

        if (!is_redis_running) {
            //redis is not running, directly serve from DB
            let results = await Events.find(find_predicate).lean();

            return res.status(200).send({
                data: results,
                time: new Date().getTime() - req.start_time,
                redis: false
            });
        }

        client.get(JSON.stringify(find_predicate), async (err, redis_result) => {
            if (err) {
                console.log('Redis error: ', err);
                throw err;
            }

            if (redis_result) {
                //serve result from redis
                return res.status(200).send({ 
                    data: JSON.parse(redis_result), 
                    time: new Date().getTime() - req.start_time, 
                    redis: true 
                });

            }

            // redis miss, query from DB
            let results = await Events.find(find_predicate).lean();

            res.status(200).send({
                data: results,
                time: new Date().getTime() - req.start_time,
                redis: false
            });

            //add the result to redis if results are there
            if (results.length) {
                try {
                    client.set(JSON.stringify(find_predicate), JSON.stringify(results), 'EX', cache_expiry);
                } catch(err) {
                    console.log(err);
                }
            }                
        });

    } catch (err) {
        console.log(err);
        return next(err);
    }
}