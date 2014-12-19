/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var PlayerActions = require("./actions/PlayerActions");

// Turn
module.exports = React.createClass({
    getInitialState: function () {
        return {
            isEditing: false,
            amount: this.props.turn.value
        };
    },

    componentWillReceiveProps: function (newProps) {
        this.setState({ amount: this.props.turn.value });
    },

    toggleEditing: function (event) {
        event.preventDefault();

        this.setState({ isEditing: !this.state.isEditing });
        if (this.state.isEditing) {
            this.refs.turnInput.getDOMNode().focus();
        }

        this.setState({ amount: this.props.turn.value });
    },

    deleteTurn: function () {
        PlayerActions.removeTurn({ playerId: this.props.playerId, turnId: this.props.turn.id });
    },

    updateTurnValue: function (event) {
        var newVal = event.target.value;

        if (!_.isNumber(+newVal) || _.isNaN(+newVal) || newVal === "") {
            this.setState({ amount: newVal });
        } else {
            PlayerActions.updateTurn({ playerId: this.props.playerId,
                                       turnId: this.props.turn.id,
                                       newValue: +newVal });
        }
    },

    render: function () {
        var classSet = React.addons.classSet;
        var classes = classSet({
            "turn": true,
            "is-editing": this.state.isEditing
        });

        var value = this.state.amount;

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
