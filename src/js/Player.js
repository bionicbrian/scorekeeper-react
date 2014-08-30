/** @jsx React.DOM */

var React = require("react/addons");
var Turn = require("./Turn");

module.exports = React.createClass({
    getInitialState: function () {
        return {
            isShowingTurns: false,
            showOrHide: "Show",
            turns: this.props.turns || [],
            isScoring: false,
            isEditing: false,
            increment: 0
        };
    },

    scoringTimeout: null,
    pointValues: [0, 1, -1],

    toggleTurns: function () {
        this.setState({ isShowingTurns: !this.state.isShowingTurns });
        this.setState({ showOrHide: this.state.showOrHide === "Show" ? "Hide" : "Show" });
    },

    deleteTurn: function (index) {
        var removedTurn = this.state.turns.splice(index, 1);
        this.setState({ turns: this.state.turns });

        if (!this.state.turns.length) {
            this.setState({ isShowingTurns: false });
        }
    },

    updateTurn: function (index, value) {
        var updatedTurn = this.state.turns.splice(index, 1, value);
        this.setState({ turns: this.state.turns });
    },

    markIt: function (val) {
        this.setState({ increment: this.state.increment + val });
        this.setState({ isScoring: true });

        clearTimeout(this.scoringTimeout);

        // Delay the actual adding of the turn until the score value is set
        this.scoringTimeout = setTimeout(this.addTurn, 1000);
    },

    addTurn: function () {
        this.setState({ turns: this.state.turns.concat([this.state.increment]) });
        this.setState({ isScoring: false });
        this.setState({ increment: 0 });
    },

    render: function () {
        var turns = [];
        var operator = "+";
        var increment = "";
        var totalPoints = 0;

        if (this.state.isScoring) {
            operator = this.state.increment < 0 ? "-" : "+";
            increment = operator + " " + Math.abs(this.state.increment);
        }

        if (this.state.turns) {
            if (this.state.isShowingTurns) {
                var that = this;
                turns = this.state.turns.map(function (turn, index) {
                    return (
                        <Turn initialAmount={turn} key={index} updateTurn={that.updateTurn} deleteTurn={that.deleteTurn} />
                    );
                });
            }

            totalPoints = this.state.turns.reduce(function (first, second) {
                return first + second;
            }, 0);
        }

        return (
            <div className="player">
                <div className={"controls" + (this.state.isScoring ? " is-scoring" : "")}>
                    <div className="name-and-score">
                        <h2>{this.props.name}</h2>
                        <div className="score">
                            <h2>{totalPoints} {increment} <span className={"turns-count" + (!this.state.isScoring ? "" : " hide-turns-count")}><span className="for">FOR</span> {this.state.turns.length}</span></h2>
                        </div>
                    </div>
                    <div className="score-buttons">
                        <button onClick={this.markIt.bind(this, -1)}>-</button>
                        <button onClick={this.markIt.bind(this, 0)}>0</button>
                        <button onClick={this.markIt.bind(this, 1)}>+</button>
                    </div>
                    <div className={"turns-link" + (this.state.turns.length > 0 ? " is-showing" : "")}>
                        <button onClick={this.toggleTurns}>{this.state.showOrHide} turns</button>
                    </div>
                </div>
                <div className={"turns" + (this.state.isShowingTurns ? " is-expanded" : "")}>
                    {turns}
                </div>
            </div>
        );
    }
});
