"use strict";

var enums = require("../utils/enums");
var AppDispatcher = require("../AppDispatcher");

// TurnActions
module.exports = {
    add: function (spec) {
        AppDispatcher.handle({
            type: enums.CREATE_TURN,
            payload: spec
        });
    },

    update: function (spec) {
        AppDispatcher.handle({
            type: enums.UPDATE_TURN,
            payload: spec
        });
    },

    remove: function (spec) {
        AppDispatcher.handle({
            type: enums.REMOVE_TURN,
            payload: spec
        });
    }
};
