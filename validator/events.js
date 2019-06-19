const add = (req, res, next) => {

    let { name, location, date, url } = req.body;

    if (!name) {
        return res.status(400).send({ message: 'Event name missing' });
    }

    if (!location) {
        return res.status(400).send({ message: 'Event location missing' });
    }

    if (!url) {
        return res.status(400).send({ message: 'Event date missing' });
    }

    if (!date) {
        return res.status(400).send({ message: 'Event date missing' });
    }

    if (!Date.parse(date)) {
        return res.status(400).send({ message: 'Bad event date given' });
    }

    req.body.date = new Date(date);

    return next();
}

const search = (req, res, next) => {

    const { date, location } = req.query;

    if (!date && !location) {
        return res.status(400).send({ message: 'No search params sent at all' });
    }

    if(date && !Date.parse(date)) {
        return res.status(400).send({ message: 'Non-parseable date string provided' });
    }   

    return next();
}

module.exports = {
    add,
    search
}