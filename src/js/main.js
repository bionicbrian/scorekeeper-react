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

var Turn = React.createClass({
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
            <div className="turn">{this.props.amount} | <button onClick={this.toggleEditing}>EDIT</button> <button onClick={this.deleteTurn}>DELETE</button></div>
        );
    }
});

var Player = React.createClass({
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
                        <Turn amount={turn} key={index} deleteTurn={that.deleteTurn} />
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
        return false;
    },
    render: function () {
        var players = this.state.players.map(function (player) {
            return (
                <Player name={player.name} turns={player.turns} />
            );
        });

        return (
            <div className="app">
                <h1>Keep Score</h1>
                <form onSubmit={this.addPlayer}>
                    <input type="text" className="name" value={this.state.newPlayerName} onChange={this.handlePlayerNameChange} onBlur={this.addPlayer} />
                    <button className="add-player-btn" onClick={this.addPlayer}>+ ADD PLAYER</button>
                </form>
                {players}
            </div>
        );
    }
});

React.renderComponent(
    <ScoreKeeper />,
    document.getElementById("main")
);
