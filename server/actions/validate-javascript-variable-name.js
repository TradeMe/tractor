'use strict';

// Dependencies:
var CharFunk = require('CharFunk');

module.exports = function (req, res) {
    var response = {
        result: CharFunk.isValidName(req.body.variableName, true)
    };

    if (!response.result) {
        res.status(400);
        response.error = 'That is not a valid variable name.';
    }

    res.send(JSON.stringify(response));
};
