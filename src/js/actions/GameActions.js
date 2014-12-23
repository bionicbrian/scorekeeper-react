"use strict";

var AppDispatcher = require("../AppDispatcher");
var enums = require("../utils/enums");

// PlayerActions
module.exports = {
    add: function (data) {
        AppDispatcher.handle({
            type: enums.ADD_GAME,
            data: data
        });
    }
};
