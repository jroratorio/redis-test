let mongoose		= require('mongoose');
mongoose.Promise 	= require('bluebird');

let conn_string = process.env.DB_URL;

mongoose = mongoose.createConnection(conn_string, (err, db) => {
    console.log(err || 'DB - Connected');
});

module.exports = mongoose;
