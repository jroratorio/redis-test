let mongoose      = require('mongoose');
let Schema 	      = mongoose.Schema;
let db 	 	      = require('../config/db');

let events         = new Schema(
    {
        name     : { type: String, required: true, unique: true        },
        location : { type: String, required: true                      },
        date     : { type: Date,   required: true, default: new Date() },
        url      : { type: String, required: true, default: null       }           
    },
    {
        timestamps : true,
        strict     : false
    }
);

module.exports = db.model('events', events);