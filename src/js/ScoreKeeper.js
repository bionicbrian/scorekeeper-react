/** @jsx React.DOM */

var React = require("react");
var Player = require("./Player");

function fetchPlayers() {
    return [
        {
            name: "Brian",
            turns: [0, -1, 5]
        },
        { name: "Rebecca" },
        { name: "Finn" },
        { name: "Dottie" }
    ];
}

module.exports = React.createClass({
    getInitialState: function () {
        return { players: fetchPlayers(), newPlayerName: "" };
    },
    handlePlayerNameChange: function (event) {
        this.setState({ newPlayerName: event.target.value });
    },
    addPlayer: function () {
        this.setState({ players: this.state.players.concat([{ name: this.state.newPlayerName }]) });
        this.setState({ newPlayerName: "" });
        return false;
    },
    render: function () {
        var players = this.state.players.map(function (player) {
            return (
                <Player name={player.name} turns={player.turns} />
            );
        });

        return (
            <div className="app">
                <h1>Keep Score</h1>
                <form onSubmit={this.addPlayer}>
                    <input type="text" className="name" value={this.state.newPlayerName} onChange={this.handlePlayerNameChange} onBlur={this.addPlayer} />
                    <button className="add-player-btn" onClick={this.addPlayer}>+ ADD PLAYER</button>
                </form>
                {players}
            </div>
        );
    }
});
