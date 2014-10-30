"use strict";

var Backbone = require("backbone");
var Player = require("./Player");

// Players collection
module.exports = Backbone.Collection.extend({
      model: Player
});
