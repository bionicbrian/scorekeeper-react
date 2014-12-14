"use strict";

var Cons = require("../Constants");
var AppDispatcher = require("../AppDispatcher");

// TurnActions
module.exports = {
    add: function (spec) {
        AppDispatcher.handle({
            type: Cons.CREATE_TURN,
            payload: spec
        });
    },

    update: function (spec) {
        AppDispatcher.handle({
            type: Cons.UPDATE_TURN,
            payload: spec
        });
    },

    remove: function (spec) {
        AppDispatcher.handle({
            type: Cons.REMOVE_TURN,
            payload: spec
        });
    }
};
