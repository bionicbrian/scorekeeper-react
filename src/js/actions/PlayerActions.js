"use strict";

var AppDispatcher = require("../AppDispatcher");
var enums = require("../utils/enums");

// PlayerActions
module.exports = {
    update: function (data) {
        AppDispatcher.handle({
            type: enums.UPDATE_PLAYER,
            data: data
        });
    },

    addTurn: function (data) {
        AppDispatcher.handle({
            type: enums.ADD_TURN,
            data: data
        });
    },

    removeTurn: function (data) {
        AppDispatcher.handle({
            type: enums.REMOVE_TURN,
            data: data
        });
    }
};
