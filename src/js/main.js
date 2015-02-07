"use strict";

import React from "react";
import Game from "./Game";

window.addEventListener("load", () => {
    new FastClick(document.body);
}, false);

React.initializeTouchEvents(true);

React.render(<Game />, document.getElementById("main"));
