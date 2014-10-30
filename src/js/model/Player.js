"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var Turns = require("./Turns");

// Player model
module.exports = Backbone.Model.extend({
  initialize: function () {
    this.set("turns", new Turns([]));
    this.get("turns").on("add", _.debounce(this.setScore.bind(this), 10));
    this.setScore();
  },

  setScore: function () {
    var score = this.get("turns").reduce(function (one, two) {
        return one + two.get("amount");
    }, 0);

    this.set("score", score);
  }
});
