const moment = require('moment');

let invalidateExistingTokens = (arr) => {

    const _1hBefore = moment(new Date()).subtract(1, 'h');

    //clearing all tokens which are more than 1 h old
    arr = arr.filter((elem) => {
        return elem.createdAt > _1hBefore;
    });

    return arr;
}

module.exports = {
    invalidateExistingTokens
};