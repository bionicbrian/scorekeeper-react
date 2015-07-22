"use strict";

var React = require("react");

export default React.createClass({
    render() {
        return (
            <button onMouseUp={this.props.markIt(this.props.incVal)}
                    onMouseDown={this.props.startIncrementing(this.props.incVal)}
                    onTouchEnd={this.props.markIt(this.props.incVal)}
                    onTouchStart={this.props.startIncrementing(this.props.incVal)}>{this.props.label}</button>
        );
    }
});
