"use strict";

import React from "React";
import Player from "./Player";
import GameActions from "./actions/GameActions";
import Store from "./store/ScoreKeeper";

export default React.createClass({
    getInitialState() {
        return { players: Store.getPlayers() };
    },

    updatePlayers() {
        this.setState({ players: Store.getPlayers() });
    },

    componentDidMount() {
        Store.addListener("CHANGE", this.updatePlayers);
    },

    componentWillUnmount() {
        Store.removeListener("CHANGE", this.updatePlayers);
    },

    addPlayer(event) {
        event.preventDefault();

        var inputEl = event.target.parentNode.querySelector("input");

        // Find a cleaner way to do this
        var newPlayerName = inputEl.value;

        if (newPlayerName) {
            GameActions.addPlayer({ name: newPlayerName });
            inputEl.value = "";
        }
    },

    render() {
        var players = this.state.players.map((player) => (<Player key={player.id} player={player} />));

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
