/** @jsx React.DOM */

var React = require("react/addons");

// Turn
module.exports = React.createClass({
    getInitialState: function () {
        return {
            isEditing: false,
            amount: this.props.initialAmount || 0
        };
    },

    componentWillMount: function () {
        console.log(this.props.amount);
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
        this.props.updateTurn(+event.target.value);
    },

    render: function () {
        var classSet = React.addons.classSet;
        var classes = classSet({
            "turn": true,
            "is-editing": this.state.isEditing
        });

        return (
            <div className={classes}>
                <span className="amount-value">{this.state.amount}</span>
                <form onSubmit={this.toggleEditing}>
                    <input value={this.state.amount} onChange={this.updateTurn} ref="turnInput" />
                </form>
                <button onClick={this.toggleEditing}>{this.state.isEditing ? "SAVE" : "EDIT"}</button>
                <button onClick={this.deleteTurn}>DELETE</button>
            </div>
        );
    }
});
