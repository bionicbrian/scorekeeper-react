/** @jsx React.DOM */

var _ = require("underscore");
var React = require("react/addons");
var PlayerActions = require("./actions/PlayerActions");
var TurnActions = require("./actions/TurnActions");

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

    deleteTurn: function (event) {
        var confirmation = confirm("Delete turn?");

        if (confirmation) {
            PlayerActions.removeTurn({ playerId: this.props.playerId, turnId: this.props.turn.id });
        }

        event.preventDefault();
    },

    updateTurnValue: function (event) {
        var newVal = event.target.value;

        if (!_.isNumber(+newVal) || _.isNaN(+newVal) || newVal === "") {
            this.setState({ amount: newVal });
        } else {
            TurnActions.update({ playerId: this.props.playerId,
                                 turnId: this.props.turn.id,
                                 newValue: +newVal });
        }
    },

    render: function () {
        var value = this.state.amount;

        return (
            <div className="row">
                <div className="large-12 small-12 columns">
                    <form onSubmit={this.toggleEditing}>
                        <div className="row collapse">
                            <div className="large-6 small-6 columns">
                                <input value={value} type="text" onChange={this.updateTurnValue} ref="turnInput" />
                            </div>
                            <div className="large-3 small-3 columns">
                                <a href="#" onClick={this.toggleEditing} className="button postfix">+</a>
                            </div>
                            <div className="large-3 small-3 columns">
                                <a href="#" onClick={this.deleteTurn} className="button postfix">x</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});
