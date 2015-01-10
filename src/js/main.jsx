/** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");
var Route = require("react-router").Route;
var DefaultRoute = require("react-router").DefaultRoute;
var App = require("./App");
var Game = require("./Game");
var GameOverview = require("./GameOverview");

window.addEventListener("load", function() {
    new FastClick(document.body);
}, false);

var routes = (
    <Route handler={App} path="/">
        <DefaultRoute handler={GameOverview} />
        <Route name="game" path="/games/:id" handler={Game} />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler />, document.getElementById("main"));
});
