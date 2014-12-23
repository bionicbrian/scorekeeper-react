/** @jsx React.DOM */

var React = require("react");

module.exports = React.createClass({
    render: function () {
        return (
            <div className="game-listing">
                <h1>{this.props.game.name}</h1>
            </div>
        );
    }
});
