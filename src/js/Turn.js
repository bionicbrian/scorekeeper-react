/** @jsx React.DOM */

var _ = require("underscore");
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
        PlayerActions.removeTurn({ playerId: this.props.playerId, turnId: this.props.turn.id });
    },

    updateTurnValue: function (event) {
        var newVal = +event.target.value;
        newVal = _.isNumber(newVal) && !_.isNaN(newVal) ? newVal : 0;
        PlayerActions.updateTurn({ playerId: this.props.playerId,
                                   turnId: this.props.turn.id,
                                   newValue: newVal });
    },

    render: function () {
        var classSet = React.addons.classSet;
        var classes = classSet({
            "turn": true,
            "is-editing": this.state.isEditing
        });

        var value = this.props.turn.value;

        return (
            <div className={classes}>
                <span className="amount-value">{value}</span>
                <form onSubmit={this.toggleEditing}>
                    <input value={value} onChange={this.updateTurnValue} ref="turnInput" />
                </form>
                <button onClick={this.toggleEditing}>{this.state.isEditing ? "SAVE" : "EDIT"}</button>
                <button onClick={this.deleteTurn}>DELETE</button>
            </div>
        );
    }
});
