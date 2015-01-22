/** @jsx React.DOM */

var React = require("react/addons");
var Turn = require("./Turn");
var PlayerActions = require("./actions/PlayerActions");
var GameActions = require("./actions/GameActions");

// Player
module.exports = React.createClass({
    getInitialState: function () {
        return {
            isShowingInput: false,
            isShowingTurns: false,
            showOrHide: "Show",
            isScoring: false,
            isEditing: false,
            increment: 0,
        };
    },

    componentWillReceiveProps: function () {
        if (this.props.player.turns.length < 1) {
            this.setState({ isShowingTurns: false });
        }
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
            that.setState({ isShowingInput: false });
            that.setState({ increment: that.state.increment + val });
            that.setState({ isScoring: true });

            clearTimeout(that.scoringTimeout);

            // Delay the actual adding of the turn until the score value is set
            that.scoringTimeout = setTimeout(that.addTurn, 1000);
        }
    },

    reset: function () {
        this.setState({ isShowingInput: false });
        this.setState({ increment: 0 });
        this.setState({ isScoring: false });
    },

    addTurn: function (turn) {
        PlayerActions.addTurn({ playerId: this.props.player.id, value: this.state.increment });
        this.reset();
    },

    addInputScore: function () {
        event.preventDefault();

        var inputEl = this.refs.scoreInput.getDOMNode();
        var newScoreValue = +inputEl.value;

        if (newScoreValue) {
            PlayerActions.addTurn({ playerId: this.props.player.id, value: newScoreValue });
            inputEl.value = "";
            this.reset();
        }

        return false;
    },

    removePlayer: function (event) {
        var confirmation = confirm("Remove " + this.props.player.name + " from the game?");

        if (confirmation) {
            GameActions.removePlayer({ playerId: this.props.player.id });
        }

        event.preventDefault();
    },

    showInput: function () {
        var scoreInputEl = this.refs.scoreInput.getDOMNode();
        if (this.state.isShowingInput) {
            scoreInputEl.value = "";
            this.setState({ isShowingInput: false });
        } else {
            this.setState({ isShowingInput: true }, function () {
                scoreInputEl.focus();
            });
        }
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
            <div className="row player">
                <div className="large-12 columns">
                    <div className="panel">

                        <div className="row controls">
                            <div className="large-4 small-4 columns">
                                <h3>{this.props.player.name}</h3>
                                <div className="row">
                                    <div className="large-12 small-12 columns">
                                        <h4>{score} {increment} <span className={(!this.state.isScoring ? "" : "hide")}>FOR {turns.length}</span></h4>
                                    </div>
                                </div>
                            </div>

                            <div className={"large-8 small-8 columns" + (!this.state.isShowingInput ? "" : " hide")}>
                                <ul className="button-group right">
                                  <li><a href="#" onClick={this.markIt(-1)} className="button small">-</a></li>
                                  <li><a href="#" onClick={this.markIt(0)} className="button small">0</a></li>
                                  <li><a href="#" onClick={this.markIt(1)} className="button small">+</a></li>
                                </ul>
                            </div>

                            <div className={"large-8 small-8 columns" + (this.state.isShowingInput ? "" : " hide")}>
                                <form onSubmit={this.addInputScore}>
                                    <div className="row">
                                        <div className="large-12 columns">
                                            <div className="row collapse">
                                                <div className="small-10 columns">
                                                    <input ref="scoreInput" type="text" placeholder="New turn value" />
                                                </div>
                                                <div className="small-2 columns">
                                                    <a href="#" onClick={this.addInputScore} className="button postfix">+</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="row">
                            <div className="large-12 columns">
                                <ul className="button-group text-center">
                                    <li><a href="#" onClick={this.toggleTurns} className={"button secondary tiny " + (turns.length > 0 ? "" : "hide")}>{this.state.showOrHide} Turns</a></li>
                                    <li><a href="#" onClick={this.showInput} className="button secondary tiny">{this.state.isShowingInput ? "Hide Input" : "Input Turn"}</a></li>
                                    <li><a href="#" onClick={this.removePlayer} className="button secondary tiny">Remove</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className={"row turns" + (this.state.isShowingTurns ? "" : "hide")}>
                            <div className="large-10 large-offset-1 small-10 small-offset-1 columns">
                                {turnsComponents}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
});
