/** @jsx React.DOM */

var React = require("react");
var ScoreKeeper = require("./ScoreKeeper");

window.addEventListener("load", function() {
    new FastClick(document.body);
}, false);

React.renderComponent(
    <ScoreKeeper />,
    document.getElementById("main")
);
