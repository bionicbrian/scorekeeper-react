/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react");
var GameActions = require("../actions/GameActions");
var store = require("../store/Scorekeeper");
var GameListing = require("./GameListing");

module.exports = React.createClass({
    getInitialState: function () {
        return { games: store.getGames() };
    },

    addGame: function (event) {
        event.preventDefault();
        var rawInput = this.refs.gameInput.getDOMNode().value + "";
        var gameName = rawInput.replace(/^\s+|\s+$/g, "");

        if (gameName) {
            this.refs.gameInput.getDOMNode().value = "";
            GameActions.add({ name: gameName, date: new Date() });
        }
    },

    updateGames: function () {
        this.setState({ games: store.getGames() });
    },

    componentWillMount: function () {
        store.on("CHANGE", this.updateGames);
    },

    componentWillUnmount: function () {
        store.removeEventListener("CHANGE", this.updateGames);
    },

    render: function () {
        var games = this.state.games.map(function (game) {
            return (<GameListing key={game.id} game={game} />);
        });

        return (
            <div>
                <form onSubmit={this.addGame}>
                    <input type="text" className="name" ref="gameInput" />
                    <button className="add-player-btn" onClick={this.addGame}>+ ADD GAME</button>
                </form>
                {games}
            </div>
        );
    }
});
