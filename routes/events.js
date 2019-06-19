const express = require('express');
const router = express.Router();

const controller = require('../controllers/events');
const validator  = require('../validator/events');

router.post('/',       validator.add,    controller.add    );
router.get('/', timer, validator.search, controller.search );

function timer(req, res, next) {
  req.start_time = new Date().getTime();  
  return next();
}

module.exports = router;