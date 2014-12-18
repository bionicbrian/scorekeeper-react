"use strict";

var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");
var Cons = require("../Constants");
var AppDispatcher = require("../AppDispatcher");
var players = [];

function addPlayer(data) {
    var id = _.uniqueId("player_");
    var player = _.extend(data, { id: id });
    player.turns = [];
    players.push(player);
}

function removePlayer(data) {
    var newPlayers = _.reject(players, function (player) {
        return player.id === data.id;
    });
    players = newPlayers;
}

function updatePlayer(data) {
    var player = _.findWhere(players, { id: data.id });
    _.extend(player, data.player);
}

function addTurn(data) {
    var player = _.findWhere(players, { id: data.playerId });
    var turn = _.extend({ value: data.value }, { id: _.uniqueId("turn_") });
    if (!player.turns) {
        player.turns = [turn];
    } else {
        player.turns.push(turn);
    }
}

function updateTurn(data) {
    var player = _.findWhere(players, { id: data.playerId });
    var turn = _.findWhere(player.turns, { id: data.turnId });
    turn.value = data.newValue;
}

function removeTurn(data) {
    var player = _.findWhere(players, { id: data.playerId });
    var newTurns = _.reject(player.turns, function (turn) {
        return turn.id === data.turnId;
    });
    player.turns = newTurns;
}

function getPlayers() {
    return players;
}

var Store = (function () {
    function F() {}
    F.prototype = EventEmitter.prototype;
    F.prototype.getPlayers = getPlayers;
    return new F();
}());

var Store = new EventEmitter();

AppDispatcher.register(function (payload) {
    var type = payload.type;

    switch (type) {
        case Cons.UPDATE_PLAYER:
            updatePlayer(payload.data);
            break;
        case Cons.ADD_PLAYER:
            addPlayer(payload.data);
            break;
        case Cons.REMOVE_PLAYER:
            removePlayer(payload.data);
            break;
        case Cons.ADD_TURN:
            addTurn(payload.data);
            break;
        case Cons.UPDATE_TURN:
            updateTurn(payload.data);
            break;
        case Cons.REMOVE_TURN:
            removeTurn(payload.data);
            break;
        default:
            break;
    }

    Store.emit("CHANGE");
});

module.exports = Store;

