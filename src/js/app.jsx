/** @jsx React.DOM */

var React = require("react");
var Game = require("./Game");

window.addEventListener("load", function() {
    new FastClick(document.body);
}, false);

React.renderComponent(
    <Game />,
    document.getElementById("main")
);
