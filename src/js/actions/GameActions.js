"use strict";

var AppDispatcher = require("../AppDispatcher");
var enums = require("../utils/enums");

// PlayerActions
module.exports = {
    addGame: function (data) {
        AppDispatcher.handle({
            type: enums.ADD_GAME,
            data: data
        });
    },

    addPlayer: function (data) {
        AppDispatcher.handle({
            type: enums.ADD_PLAYER,
            data: data
        });
    },

    removePlayer: function (data) {
        AppDispatcher.handle({
            type: enums.REMOVE_PLAYER,
            data: data
        });
    }
};
