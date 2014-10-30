"use strict";

var Backbone = require("backbone");
var Turn = require("./Turn");

module.exports = Backbone.Collection.extend({
    model: Turn
});
