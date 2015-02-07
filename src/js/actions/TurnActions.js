"use strict";

var enums = require("../utils/enums");
var AppDispatcher = require("../AppDispatcher");

// TurnActions
module.exports = {
    update: function (data) {
        AppDispatcher.handle({
            type: enums.UPDATE_TURN,
            data: data
        });
    }
};
