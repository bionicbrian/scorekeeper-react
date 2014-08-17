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
        return { isEditing: false };
    },
    toggleEditing: function () {
        this.setState({ isEditing: !this.state.isEditing });
    },
    deleteTurn: function () {
        this.props.deleteTurn(this.props.key);
    },
    render: function () {
        return (
            React.DOM.div({className: "turn"}, this.props.amount, " | ", React.DOM.button({onClick: this.toggleEditing}, "EDIT"), " ", React.DOM.button({onClick: this.deleteTurn}, "DELETE"))
        );
    }
});

var Player = React.createClass({displayName: 'Player',
    getInitialState: function () {
        return {
            isShowingTurns: false,
            showOrHide: "Show",
            turns: this.props.turns || [],
            turnsCount: this.props.turns && this.props.turns.length || 0,
            isScoring: false,
            isEditing: false,
            increment: 0
        };
    },

    scoringTimeout: null,
    pointValues: [0, 1, -1],

    incrementTurns: _.debounce(function (player) {
        this.setState({ turnsCount: this.state.turnsCount + 1 });
    }, 1000, true),

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

        this.setState({ turnsCount: this.state.turnsCount - 1 });
    },

    markIt: function (val) {
        this.setState({ increment: this.state.increment + val });
        this.setState({ isScoring: true });

        clearTimeout(this.scoringTimeout);

        // Delay the actual adding of the turn until the score value is set
        this.scoringTimeout = setTimeout(this.addTurn, 1000);

        this.incrementTurns();

        return false;
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
                        Turn({amount: turn, key: index, deleteTurn: that.deleteTurn})
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
                            React.DOM.h2(null, totalPoints, " ", increment, " ", React.DOM.span({className: "for"}, "FOR"), " ", this.state.turnsCount)
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
                React.DOM.input({type: "text", className: "name", value: this.state.newPlayerName, onChange: this.handlePlayerNameChange}), 
                React.DOM.button({className: "add-player-btn", onClick: this.addPlayer}, "+ ADD PLAYER"), 
                players
            )
        );
    }
});

React.renderComponent(
    ScoreKeeper(null),
    document.getElementById("main")
);
