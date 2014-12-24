"use strict";

var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");
var enums = require("../utils/enums");
var AppDispatcher = require("../AppDispatcher");
var games = [];
var players = [];

function addGame(data) {
    var id = _.uniqueId("game_");
    var game = _.extend(data, { id: id });
    games.push(game);
}

function addPlayer(data) {
    var id = _.uniqueId("player_");
    var player = _.extend(data, { id: id });
    player.turns = [];
    players.push(player);
}

function removePlayer(data) {
    var newPlayers = _.reject(players, function (player) {
        return player.id === data.playerId;
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

function getGames() {
    return games;
}

function Store() { }
Store.prototype = Object.create(EventEmitter.prototype);
Store.prototype.getPlayers = getPlayers;
Store.prototype.getGames = getGames;

var store = new Store();

AppDispatcher.register(function (payload) {
    var type = payload.type;

    switch (type) {
        case enums.ADD_GAME:
            addGame(payload.data);
            break;
        case enums.UPDATE_PLAYER:
            updatePlayer(payload.data);
            break;
        case enums.ADD_PLAYER:
            addPlayer(payload.data);
            break;
        case enums.REMOVE_PLAYER:
            removePlayer(payload.data);
            break;
        case enums.ADD_TURN:
            addTurn(payload.data);
            break;
        case enums.UPDATE_TURN:
            updateTurn(payload.data);
            break;
        case enums.REMOVE_TURN:
            removeTurn(payload.data);
            break;
        default:
            break;
    }

    store.emit("CHANGE");
});

module.exports = store;

