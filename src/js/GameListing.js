"use strict";

import React from "react";

export default React.createClass({
    render() {
        return (
            <div className="game-listing">
                <h1>{this.props.game.name}</h1>
            </div>
        );
    }
});
