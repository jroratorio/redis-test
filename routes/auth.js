const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

router.get('/get-token', controller.generate_token);

module.exports = router;