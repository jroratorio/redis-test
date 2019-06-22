require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const events = require('./routes/events');
const auth = require('./routes/auth');
const auth_controller = require('./controllers/auth');


const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', auth);
app.use('/api/events', auth_controller.isAuthenticated, events);


// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	return next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	return res.status(err.status || 500).render('error');
});

module.exports = app;
