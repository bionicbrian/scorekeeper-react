/** @jsx React.DOM */

var React = require("react");
var Player = require("./Player");
var Players = require("./model/Players");

function fetchPlayers() {
    return new Players([
        { name: "Brian" },
        { name: "Rebecca" },
        { name: "Finn" },
        { name: "Dottie" }
    ]);
}

module.exports = React.createClass({
    getInitialState: function () {
        return { players: fetchPlayers() };
    },

    componentDidMount: function () {
        this.state.players.on("add", function () {
            this.forceUpdate();
        }.bind(this));
    },

    addPlayer: function (event) {
        event.preventDefault();

        // Find a cleaner way to do this
        var newPlayerName = event.target.parentNode.querySelector("input").value;

        if (newPlayerName) {
            this.state.players.add({ name: newPlayerName });
        }

        return false;
    },

    render: function () {
        console.log("player list render");
        var players = this.state.players.map(function (player) {
            return (
                <Player key={player.cid} player={player} />
            );
        });

        return (
            <div className="app">
                <h1>Keep Score</h1>
                <form onSubmit={this.addPlayer}>
                    <input type="text"
                           className="name"
                           value={this.state.newPlayerName}
                           onChange={this.handlePlayerNameChange} />
                    <button className="add-player-btn" onClick={this.addPlayer}>+ ADD PLAYER</button>
                </form>
                {players}
            </div>
        );
    }
});
