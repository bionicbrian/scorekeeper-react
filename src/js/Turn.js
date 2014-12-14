/** @jsx React.DOM */

var React = require("react/addons");
var PlayerActions = require("./actions/PlayerActions");

// Turn
module.exports = React.createClass({
    getInitialState: function () {
        return { isEditing: false };
    },

    toggleEditing: function () {
        this.setState({ isEditing: !this.state.isEditing });
        if (this.state.isEditing) {
            this.refs.turnInput.getDOMNode().focus();
        }
    },

    deleteTurn: function () {
        PlayerActions.removeTurn({ id: this.props.turn.id });
    },

    updateTurnValue: function (event) {
        PlayerActions.updateTurn({ playerId: this.props.playerId,
                                   turnId: this.props.turn.id,
                                   newValue: +event.target.value });
    },

    render: function () {
        var classSet = React.addons.classSet;
        var classes = classSet({
            "turn": true,
            "is-editing": this.state.isEditing
        });

        return (
            <div className={classes}>
                <span className="amount-value">{this.props.turn.value}</span>
                <form onSubmit={this.toggleEditing}>
                    <input value={this.props.turn.value} onChange={this.updateTurnValue} ref="turnInput" />
                </form>
                <button onClick={this.toggleEditing}>{this.state.isEditing ? "SAVE" : "EDIT"}</button>
                <button onClick={this.deleteTurn}>DELETE</button>
            </div>
        );
    }
});
