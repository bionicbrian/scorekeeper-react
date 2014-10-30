"use strict";

var Backbone = require("backbone");
var Turn = require("./Turn");

module.exports = Backbone.Collection.extend({
    model: Turn,
    intialize: function () {
        this.on("remove", function () {
            console.log("someone tried to remove a turn");
        });
    }
});
