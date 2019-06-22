const secret = process.env.SECRET;  

const uuid = require('uuid/v4');

const invalidateExistingTokens = require('../utils').invalidateExistingTokens;

let auth_controller = {};

let arr = [];

auth_controller.generate_token = (req, res, next ) => {    

    const token = req.headers['x-access-token'];

    if(!token) {
        return res.status(403).send({ message: 'APP-TOKEN MISSING' });
    }

    if(token !== secret) {
        return res.status(403).send({ message: 'APP-TOKEN MISMATCH' });

    }

    const random = uuid();

    arr.push({ 
        token: random, 
        createdAt: new Date() 
    });

    return res.status(200).send({ token: random });
}

auth_controller.isAuthenticated = (req, res, next) => {

    arr = invalidateExistingTokens(arr);

    if(!req.headers['authorization']) {
        return res.status(403).send({ message: 'Authorization token missing'});
    }

    const index = arr.findIndex((elem) => {
        return elem.token === req.headers['authorization'];
    });

    if(index === -1) {
        return res.status(403).send({ message: 'Token expired' });
    }

    return next();
}

module.exports = auth_controller;
