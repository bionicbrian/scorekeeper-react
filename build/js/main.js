/** @jsx React.DOM */

window.addEventListener("load", function() {
    new FastClick(document.body);
}, false);

function fetchPlayers() {
    return [
        {
            name: "Brian",
            turns: [0, -1, 5]
        },
        { name: "Rebecca" },
        { name: "Finn" },
        { name: "Dottie" }
    ];
}

var Turn = React.createClass({displayName: 'Turn',
    getInitialState: function () {
        return {
            isEditing: false,
            amount: this.props.initialAmount
        };
    },
    toggleEditing: function () {
        this.setState({ isEditing: !this.state.isEditing });
        if (this.state.isEditing) {
            this.refs.turnInput.getDOMNode().focus();
        }
    },
    deleteTurn: function () {
        this.props.deleteTurn(this.props.key);
    },
    updateValue: function (event) {
        this.setState({ amount: +event.target.value });
        this.props.updateTurn(this.props.key, +event.target.value);
    },
    render: function () {
        var cx = React.addons.classSet;
        var classes = cx({
            "turn": true,
            "is-editing": this.state.isEditing
        });
        return (
            React.DOM.div({className: classes}, 
                React.DOM.span({className: "amount-value"}, this.state.amount), 
                React.DOM.form({onSubmit: this.toggleEditing}, 
                    React.DOM.input({value: this.state.amount, onChange: this.updateValue, ref: "turnInput"})
                ), 
                React.DOM.button({onClick: this.toggleEditing}, this.state.isEditing ? "SAVE" : "EDIT"), 
                React.DOM.button({onClick: this.deleteTurn}, "DELETE")
            )
        );
    }
});

var Player = React.createClass({displayName: 'Player',
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
                        Turn({initialAmount: turn, key: index, updateTurn: that.updateTurn, deleteTurn: that.deleteTurn})
                    );
                });
            }

            totalPoints = this.state.turns.reduce(function (first, second) {
                return first + second;
            }, 0);
        }

        return (
            React.DOM.div({className: "player"}, 
                React.DOM.div({className: "controls" + (this.state.isScoring ? " is-scoring" : "")}, 
                    React.DOM.div({className: "name-and-score"}, 
                        React.DOM.h2(null, this.props.name), 
                        React.DOM.div({className: "score"}, 
                            React.DOM.h2(null, totalPoints, " ", increment, " ", React.DOM.span({className: "turns-count" + (!this.state.isScoring ? "" : " hide-turns-count")}, React.DOM.span({className: "for"}, "FOR"), " ", this.state.turns.length))
                        )
                    ), 
                    React.DOM.div({className: "score-buttons"}, 
                        React.DOM.button({onClick: this.markIt.bind(this, -1)}, "-"), 
                        React.DOM.button({onClick: this.markIt.bind(this, 0)}, "0"), 
                        React.DOM.button({onClick: this.markIt.bind(this, 1)}, "+")
                    ), 
                    React.DOM.div({className: "turns-link" + (this.state.turns.length > 0 ? " is-showing" : "")}, 
                        React.DOM.button({onClick: this.toggleTurns}, this.state.showOrHide, " turns")
                    )
                ), 
                React.DOM.div({className: "turns" + (this.state.isShowingTurns ? " is-expanded" : "")}, 
                    turns
                )
            )
        );
    }
});

var ScoreKeeper = React.createClass({displayName: 'ScoreKeeper',
    getInitialState: function () {
        return { players: fetchPlayers(), newPlayerName: "" };
    },
    handlePlayerNameChange: function (event) {
        this.setState({ newPlayerName: event.target.value });
    },
    addPlayer: function () {
        this.setState({ players: this.state.players.concat([{ name: this.state.newPlayerName }]) });
        this.setState({ newPlayerName: "" });
        return false;
    },
    render: function () {
        var players = this.state.players.map(function (player) {
            return (
                Player({name: player.name, turns: player.turns})
            );
        });

        return (
            React.DOM.div({className: "app"}, 
                React.DOM.h1(null, "Keep Score"), 
                React.DOM.form({onSubmit: this.addPlayer}, 
                    React.DOM.input({type: "text", className: "name", value: this.state.newPlayerName, onChange: this.handlePlayerNameChange, onBlur: this.addPlayer}), 
                    React.DOM.button({className: "add-player-btn", onClick: this.addPlayer}, "+ ADD PLAYER")
                ), 
                players
            )
        );
    }
});

React.renderComponent(
    ScoreKeeper(null),
    document.getElementById("main")
);
