/** @jsx React.DOM */

var React = require("react");
var Player = require("./Player");
var PlayerActions = require("./actions/PlayerActions");
var Store = require("./store/ScoreKeeper");

module.exports = React.createClass({
    getInitialState: function () {
        return { players: Store.getPlayers() };
    },

    updatePlayers: function () {
        this.setState({ players: Store.getPlayers() });
    },

    componentDidMount: function () {
        Store.addListener("CHANGE", this.updatePlayers);
    },

    componentWillUnmount: function () {
        Store.removeListener("CHANGE", this.updatePlayers);
    },

    addPlayer: function (event) {
        event.preventDefault();

        // Find a cleaner way to do this
        var newPlayerName = event.target.parentNode.querySelector("input").value;

        if (newPlayerName) {
            PlayerActions.add({ name: newPlayerName });
        }

        return false;
    },

    render: function () {
        var players = this.state.players.map(function (player) {
            return (<Player key={player.id} player={player} />);
        });

        return (
            <div className="app">
                <h1>Keep Score</h1>
                <form onSubmit={this.addPlayer}>
                    <input type="text" className="name" />
                    <button className="add-player-btn" onClick={this.addPlayer}>+ ADD PLAYER</button>
                </form>
                {players}
            </div>
        );
    }
});
