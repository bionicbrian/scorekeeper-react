/** @jsx React.DOM */

var Backbone = require("backbone");
var React = require("react/addons");
var Turn = require("./Turn");
var TurnModel = Backbone.Model.extend({ });

// Player
module.exports = React.createClass({
    getInitialState: function () {
        return {
            isShowingTurns: false,
            showOrHide: "Show",
            isScoring: false,
            totalPoints: 0,
            isEditing: false,
            increment: 0,
            turns: this.props.turns || []
        };
    },

    componentWillMount: function () {
        this.updateTotalPoints();
    },

    scoringTimeout: null,
    pointValues: [0, 1, -1],

    toggleTurns: function () {
        this.setState({ isShowingTurns: !this.state.isShowingTurns });
        this.setState({ showOrHide: this.state.showOrHide === "Show" ? "Hide" : "Show" });
    },

    deleteTurn: function (todo) {
        var newTurns = this.state.turns.filter(function (turn) { return id !== turn.id; });
        this.setState({ turns: newTurns });

        if (!this.state.turns.length) {
            this.setState({ isShowingTurns: false });
        }
    },

    markIt: function (val) {
        this.setState({ increment: this.state.increment + val });
        this.setState({ isScoring: true });

        clearTimeout(this.scoringTimeout);

        // Delay the actual adding of the turn until the score value is set
        this.scoringTimeout = setTimeout(this.addTurn, 1000);
    },

    addTurn: function () {
        // var newTurn = new TurnModel({ amount: +this.state.increment });
        this.setState({ turns: this.state.turns.concat([{ initialAmount: +this.state.increment }]) });
        this.setState({ isScoring: false });
        this.setState({ increment: 0 });
        this.updateTotalPoints();
    },

    updateTurn: function (turn, value) {
        this.deleteTurn(turn);
        this.setState({ turns: this.state.turns.concat([value]) });
    },

    updateTotalPoints: function () {
        var totalPoints = this.state.turns.reduce(function (first, second) {
            return first.amount + second.amount;
        }, 0);

        this.setState({ totalPoints: totalPoints });
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return nextProps.cid !== this.props.cid;
    },

    render: function () {
        console.log("Player render called for " + this.props.player.cid);

        var turnsComponents = []; var operator = "+"; var increment = "";

        if (this.state.isScoring) {
            operator = this.state.increment < 0 ? "-" : "+";
            increment = operator + " " + Math.abs(this.state.increment);
        }

        if (this.state.turns) {
            if (this.state.isShowingTurns) {
                var that = this;
                turnsComponents = this.state.turns.map(function (turn, index) {
                    return (
                        <Turn initialAmount={turn} key={index} updateTotalPoints={this.updateTotalPoints.bind(this, turn)} deleteTurn={that.deleteTurn} />
                    );
                });
            }
        }

        return (
            <div className="player">
                <div className={"controls" + (this.state.isScoring ? " is-scoring" : "")}>
                    <div className="name-and-score">
                        <h2>{this.props.player.get("name")}</h2>
                        <div className="score">
                            <h2>{this.state.totalPoints} {increment} <span className={"turns-count" + (!this.state.isScoring ? "" : " hide-turns-count")}><span className="for">FOR</span> {this.state.turns.length}</span></h2>
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
                    {turnsComponents}
                </div>
            </div>
        );
    }
});
