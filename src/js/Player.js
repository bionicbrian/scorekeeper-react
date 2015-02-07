"use strict";

import React from "react";
import Turn from "./Turn";
import PlayerActions from "./actions/PlayerActions";
import GameActions from "./actions/GameActions";

export default React.createClass({
    getInitialState() {
        return {
            isShowingInput: false,
            isShowingTurns: false,
            isIncrementing: false,
            showOrHide: "Show",
            isScoring: false,
            isEditing: false,
            increment: 0,
        };
    },

    componentWillReceiveProps() {
        if (this.props.player.turns.length < 1) {
            this.setState({ isShowingTurns: false });
        }
    },

    scoringTimeout: null,
    pointValues: [0, 1, -1],
    incrementTimer: null,

    toggleTurns() {
        this.setState({ isShowingTurns: !this.state.isShowingTurns });
        this.setState({ showOrHide: this.state.showOrHide === "Show" ? "Hide" : "Show" });
    },

    markIt(val) {
        return () => {
            this.setState({ isShowingInput: false });

            clearTimeout(this.scoringTimeout);
            clearTimeout(this.incrementTimer);

            // Delay the actual adding of the turn until the score value is set
            this.scoringTimeout = setTimeout(this.addTurn, 1000);
        };
    },

    startIncrementing(val) {
        var speed;

        var increment = () => {
            speed = speed - (speed * 0.1);
            this.setState({ increment: this.state.increment + val });
            this.incrementTimer = setTimeout(increment, speed);
        };

        return () => {
            speed = 210;
            this.setState({ isScoring: true });
            this.setState({ increment: this.state.increment + val });
            console.log("scoring now");
            this.incrementTimer = setTimeout(increment, 800);
        };
    },

    reset() {
        this.setState({ isShowingInput: false });
        this.setState({ increment: 0 });
        this.setState({ isScoring: false });
    },

    addTurn(turn) {
        PlayerActions.addTurn({ playerId: this.props.player.id, value: this.state.increment });
        this.reset();
    },

    addInputScore() {
        event.preventDefault();

        var inputEl = this.refs.scoreInput.getDOMNode();
        var newScoreValue = +inputEl.value;

        if (newScoreValue) {
            PlayerActions.addTurn({ playerId: this.props.player.id, value: newScoreValue });
            inputEl.value = "";
            this.reset();
        }
    },

    removePlayer(event) {
        event.preventDefault();

        var confirmation = confirm("Remove " + this.props.player.name + " from the game?");

        if (confirmation) {
            GameActions.removePlayer({ playerId: this.props.player.id });
        }
    },

    showInput() {
        var scoreInputEl = this.refs.scoreInput.getDOMNode();
        if (this.state.isShowingInput) {
            scoreInputEl.value = "";
            this.setState({ isShowingInput: false });
        } else {
            this.setState({ isShowingInput: true }, () => scoreInputEl.focus());
        }
    },

    render() {
        var turnsComponents = [];
        var operator = "+";
        var increment = "";

        var turns = this.props.player.turns;
        var score = turns.reduce((score, turn) => {
            return score + turn.value;
        }, 0);

        if (this.state.isScoring) {
            operator = this.state.increment < 0 ? "-" : "+";
            increment = operator + " " + Math.abs(this.state.increment);
        }

        if (turns.length > 0 && this.state.isShowingTurns) {
            turnsComponents = turns.map((turn) => {
                return (<Turn turn={turn} playerId={this.props.player.id} key={turn.id} />);
            });
        }

        return (
            <div className="player">
                <div className={"controls" + (this.state.isScoring ? " is-scoring" : "")}>
                    <div className="name-and-score">
                        <h2>{this.props.player.name}</h2>
                        <div className="score">
                            <h2>{score} {increment} <span className={"turns-count" + (!this.state.isScoring ? "" : " hide-turns-count")}><span className="for">FOR</span> {turns.length}</span></h2>
                        </div>
                    </div>

                    <div className="score-buttons">
                        <button onMouseUp={this.markIt(-1)}
                                onMouseDown={this.startIncrementing(-1)}
                                onTouchEnd={this.markIt(-1)}
                                onTouchStart={this.startIncrementing(-1)}>-</button>
                        <button onMouseUp={this.markIt(0)}
                                onMouseDown={this.startIncrementing(0)}
                                onTouchEnd={this.markIt(0)}
                                onTouchStart={this.startIncrementing(0)}>0</button>
                        <button onMouseUp={this.markIt(1)}
                                onMouseDown={this.startIncrementing(1)}
                                onTouchEnd={this.markIt(1)}
                                onTouchStart={this.startIncrementing(1)}>+</button>
                    </div>

                    <div className={"score-input-container" + (this.state.isShowingInput ? " is-showing" : " is-hidden")}>
                        <form onSubmit={this.addInputScore}>
                            <input type="text" ref="scoreInput" />
                            <button className="add-score-btn" onClick={this.addInputScore}>+ ADD TURN</button>
                        </form>
                    </div>

                    <div className="admin-buttons">
                        <button className={turns.length > 0 ? "is-showing" : "is-hidden"} onClick={this.toggleTurns}>{this.state.showOrHide} Turns</button>
                        <button onClick={this.showInput}>{this.state.isShowingInput ? "Hide Input" : "Input Turn"}</button>
                        <button onClick={this.removePlayer}>Remove Player</button>
                    </div>

                </div>
                <div className={"turns" + (this.state.isShowingTurns ? " is-expanded" : "")}>
                    {turnsComponents}
                </div>
            </div>
        );
    }
});
