/** @jsx React.DOM */

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

var Turn = React.createClass({
    render: function () {
        return (
            <span class="turnValue">{this.props.amount}</span>
        );
    }
});

var Player = React.createClass({
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

    markIt: function (val) {
        this.setState({ increment: this.state.increment + val });
        this.setState({ isScoring: true });

        clearTimeout(this.scoringTimeout);

        // Delay the actual adding of the turn until the score value is set
        this.scoringTimeout = setTimeout(this.addTurn.bind(this), 1000);

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
                turns = this.state.turns.map(function (turn) {
                    return (
                        <li><Turn amount={turn} /></li>
                    );
                });
            }

            totalPoints = this.state.turns.reduce(function (first, second) {
                return first + second;
            }, 0);
        }

        return (
            <div class="player">
                {this.props.name} | {totalPoints} {increment} for {this.state.turnsCount} | <button onClick={this.markIt.bind(this, -1)}>-</button> | <button onClick={this.markIt.bind(this, 0)}>0</button> | <button onClick={this.markIt.bind(this, 1)}>+</button> | <button onClick={this.toggleTurns}>{this.state.showOrHide} turns</button>
                <ul>
                    {turns}
                </ul>
            </div>
        );
    }
});

var ScoreKeeper = React.createClass({
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
                <li><Player name={player.name} turns={player.turns} /></li>
            );
        });

        return (
            <div class="app">
                <h1>Keep Score</h1>
                <input type="text" value={this.state.newPlayerName} onChange={this.handlePlayerNameChange} />
                <button onClick={this.addPlayer}>Add Player</button>
                <ul>
                    {players}
                </ul>
            </div>
        );
    }
});

React.renderComponent(
    <ScoreKeeper />,
    document.getElementById("main")
);
