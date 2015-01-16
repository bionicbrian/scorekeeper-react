"use strict";

var enums = require("../utils/enums");
var AppDispatcher = require("../AppDispatcher");

// TurnActions
module.exports = {
    update: function (spec) {
        AppDispatcher.handle({
            type: enums.UPDATE_TURN,
            payload: spec
        });
    }
};
