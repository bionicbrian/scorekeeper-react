/** @jsx React.DOM */

var React = require("react");
var Player = require("./Player");
var GameActions = require("./actions/GameActions");
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

        var inputEl = event.target.parentNode.querySelector("input");

        // Find a cleaner way to do this
        var newPlayerName = inputEl.value;

        if (newPlayerName) {
            GameActions.addPlayer({ name: newPlayerName });
            inputEl.value = "";
        }

        return false;
    },

    render: function () {
        var players = this.state.players.map(function (player) {
            return (<Player key={player.id} player={player} />);
        });

        return (
            <div className="app">
                <div className="row">
                    <div className="large-12 columns">
                        <h1>Keep Score</h1>
                    </div>
                </div>

                <form onSubmit={this.addPlayer}>
                    <div className="row">
                        <div className="large-12 columns">
                            <div className="row collapse">
                                <div className="small-10 columns">
                                    <input type="text" placeholder="New player name" />
                                </div>
                                <div className="small-2 columns">
                                    <a href="#" onClick={this.addPlayer} className="button postfix">+</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {players}
            </div>
        );
    }
});
