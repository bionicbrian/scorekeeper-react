/** @jsx React.DOM */

var React = require("react/addons");
var Turn = require("./Turn");
var PlayerActions = require("./actions/PlayerActions");

// Player
module.exports = React.createClass({
    getInitialState: function () {
        return {
            isShowingTurns: false,
            showOrHide: "Show",
            isScoring: false,
            isEditing: false,
            increment: 0,
        };
    },

    scoringTimeout: null,
    pointValues: [0, 1, -1],

    toggleTurns: function () {
        this.setState({ isShowingTurns: !this.state.isShowingTurns });
        this.setState({ showOrHide: this.state.showOrHide === "Show" ? "Hide" : "Show" });
    },

    markIt: function (val) {
        var that = this;
        return function () {
            console.log("markIt was called with val " + val);
            that.setState({ increment: that.state.increment + val });
            that.setState({ isScoring: true });

            clearTimeout(that.scoringTimeout);

            // Delay the actual adding of the turn until the score value is set
            that.scoringTimeout = setTimeout(that.addTurn, 1000);
        }
    },

    reset: function () {
        this.setState({ increment: 0 });
        this.setState({ isScoring: false });
    },

    addTurn: function (turn) {
        PlayerActions.addTurn({ playerId: this.props.key, value: this.state.increment });
        this.reset();
    },

    render: function () {
        var turnsComponents = [];
        var operator = "+";
        var increment = "";

        var turns = this.props.player.turns;
        var score = turns.reduce(function (score, turn) {
            return score + turn.value;
        }, 0);

        if (this.state.isScoring) {
            operator = this.state.increment < 0 ? "-" : "+";
            increment = operator + " " + Math.abs(this.state.increment);
        }

        if (turns.length > 0 && this.state.isShowingTurns) {
            var that = this;
            turnsComponents = turns.map(function (turn) {
                return (<Turn turn={turn} playerId={that.props.player.id} key={turn.id} />);
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
                        <button onClick={this.markIt(-1)}>-</button>
                        <button onClick={this.markIt(0)}>0</button>
                        <button onClick={this.markIt(1)}>+</button>
                    </div>
                    <div className={"turns-link" + (turns.length > 0 ? " is-showing" : "")}>
                        <button onClick={this.toggleTurns}>{this.state.showOrHide} turns</button>
                    </div>
                </div>
                <div className={"turns" + (this.state.isShowingTurns ? " is-expanded" : "")}>
                    {turnsComponents}
                </div>
            </div>
        );
    }
});
