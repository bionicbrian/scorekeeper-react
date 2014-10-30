/** @jsx React.DOM */

var Backbone = require("backbone");
var React = require("react/addons");
var Turn = require("./Turn");

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

    componentWillMount: function () {
        var that = this;
        this.props.player.on("change", function () {
            that.forceUpdate();
        });
        this.props.player.get("turns").on("remove", function () {
            that.forceUpdate();
        });
    },

    scoringTimeout: null,
    pointValues: [0, 1, -1],

    toggleTurns: function () {
        this.setState({ isShowingTurns: !this.state.isShowingTurns });
        this.setState({ showOrHide: this.state.showOrHide === "Show" ? "Hide" : "Show" });
    },

    deleteTurn: function (turn) {
        console.log("gonna delete a turn");
        this.props.player.get("turns").remove(turn);

        if (this.props.player.get("turns").length < 1) {
            this.setState({ isShowingTurns: false });
        }
    },

    markIt: function (val) {
        console.log("markIt was called with val " + val);
        this.setState({ increment: this.state.increment + val });
        this.setState({ isScoring: true });

        clearTimeout(this.scoringTimeout);

        // Delay the actual adding of the turn until the score value is set
        this.scoringTimeout = setTimeout(this.addTurn, 1000);
    },

    addTurn: function () {
        this.props.player.get("turns").add({ amount: +this.state.increment });
        this.setState({ isScoring: false });
        this.setState({ increment: 0 });
    },

    // shouldComponentUpdate: function(nextProps, nextState) {
    //     return nextProps.cid !== this.props.cid;
    // },

    render: function () {
        var turnsComponents = [];
        var operator = "+";
        var increment = "";

        var turns = this.props.player.get("turns");
        var score = this.props.player.get("score");

        if (this.state.isScoring) {
            operator = this.state.increment < 0 ? "-" : "+";
            increment = operator + " " + Math.abs(this.state.increment);
        }

        if (turns.length > 0) {
            if (this.state.isShowingTurns) {
                var that = this;
                turnsComponents = turns.map(function (turn) {
                    return (
                        <Turn turn={turn} key={turn.cid} deleteTurn={that.deleteTurn.bind(that, turn)} />
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
                            <h2>{score} {increment} <span className={"turns-count" + (!this.state.isScoring ? "" : " hide-turns-count")}><span className="for">FOR</span> {turns.length}</span></h2>
                        </div>
                    </div>
                    <div className="score-buttons">
                        <button onClick={this.markIt.bind(this, -1)}>-</button>
                        <button onClick={this.markIt.bind(this, 0)}>0</button>
                        <button onClick={this.markIt.bind(this, 1)}>+</button>
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
