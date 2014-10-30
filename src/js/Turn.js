/** @jsx React.DOM */

var React = require("react/addons");

// Turn
// props are:
// turn: the model
// key: turn.cid
// deleteTurn: collection remove method bound to this turn
module.exports = React.createClass({
    getInitialState: function () {
        return { isEditing: false };
    },

    componentWillMount: function () {
        this.props.turn.on("change", function () {
            this.forceUpdate();
        }.bind(this));
    },

    toggleEditing: function () {
        this.setState({ isEditing: !this.state.isEditing });
        if (this.state.isEditing) {
            this.refs.turnInput.getDOMNode().focus();
        }
    },

    deleteTurn: function () {
        this.props.deleteTurn();
    },

    updateAmount: function (event) {
        this.props.turn.set("amount", +event.target.value);
    },

    render: function () {
        var classSet = React.addons.classSet;
        var classes = classSet({
            "turn": true,
            "is-editing": this.state.isEditing
        });

        return (
            <div className={classes}>
                <span className="amount-value">{this.props.turn.get("amount")}</span>
                <form onSubmit={this.toggleEditing}>
                    <input value={this.props.turn.get("amount")} onChange={this.updateAmount} ref="turnInput" />
                </form>
                <button onClick={this.toggleEditing}>{this.state.isEditing ? "SAVE" : "EDIT"}</button>
                <button onClick={this.deleteTurn}>DELETE</button>
            </div>
        );
    }
});
