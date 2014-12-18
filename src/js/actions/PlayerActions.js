"use strict";

var AppDispatcher = require("../AppDispatcher");
var Cons = require("../Constants");

// PlayerActions
module.exports = {
    add: function (data) {
        AppDispatcher.handle({
            type: Cons.ADD_PLAYER,
            data: data
        });
    },

    update: function (data) {
        AppDispatcher.handle({
            type: Cons.UPDATE_PLAYER,
            data: data
        });
    },

    remove: function (data) {
        AppDispatcher.handle({
            type: Cons.REMOVE_PLAYER,
            data: data
        });
    },

    addTurn: function (data) {
        AppDispatcher.handle({
            type: Cons.ADD_TURN,
            data: data
        });
    },

    updateTurn: function (data) {
        AppDispatcher.handle({
            type: Cons.UPDATE_TURN,
            data: data
        });
    },

    removeTurn: function (data) {
        AppDispatcher.handle({
            type: Cons.REMOVE_TURN,
            data: data
        });
    }
};
