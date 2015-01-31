"use strict";

import _ from "underscore";
import React from "react";
import GameActions from "../actions/GameActions";
import store from "../store/Scorekeeper";
import GameListing from "./GameListing";

export default React.createClass({
    getInitialState() {
        return { games: store.getGames() };
    },

    addGame(event) {
        event.preventDefault();

        var rawInput = this.refs.gameInput.getDOMNode().value + "";
        var gameName = rawInput.replace(/^\s+|\s+$/g, "");

        if (gameName) {
            this.refs.gameInput.getDOMNode().value = "";
            GameActions.addGame({ name: gameName, date: new Date() });
        }
    },

    updateGames() {
        this.setState({ games: store.getGames() });
    },

    componentWillMount() {
        store.on("CHANGE", this.updateGames);
    },

    componentWillUnmount() {
        store.removeEventListener("CHANGE", this.updateGames);
    },

    render() {
        var games = this.state.games.map((game) => {
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
