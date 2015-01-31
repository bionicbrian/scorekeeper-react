"use strict";

import _ from "underscore";
import React from "react/addons";
import PlayerActions from "./actions/PlayerActions";
import TurnActions from "./actions/TurnActions";

export default React.createClass({
    getInitialState() {
        return {
            isEditing: false,
            amount: this.props.turn.value
        };
    },

    componentWillReceiveProps(newProps) {
        this.setState({ amount: this.props.turn.value });
    },

    toggleEditing(event) {
        event.preventDefault();

        this.setState({ isEditing: !this.state.isEditing });
        if (this.state.isEditing) {
            this.refs.turnInput.getDOMNode().focus();
        }

        this.setState({ amount: this.props.turn.value });
    },

    deleteTurn() {
        PlayerActions.removeTurn({ playerId: this.props.playerId, turnId: this.props.turn.id });
    },

    updateTurnValue(event) {
        var newVal = event.target.value;

        if (!_.isNumber(+newVal) || _.isNaN(+newVal) || newVal === "") {
            this.setState({ amount: newVal });
        } else {
            TurnActions.update({ playerId: this.props.playerId,
                                 turnId: this.props.turn.id,
                                 newValue: +newVal });
        }
    },

    render() {
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
