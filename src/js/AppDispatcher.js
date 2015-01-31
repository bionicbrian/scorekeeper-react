"use strict";

var AppDispatcher = {
    callbacks: [],
    register(callback) {
        this.callbacks.push(callback);
    },
    handle(data) {
        this.callbacks.forEach((cb) => cb(data));
    }
};

export default AppDispatcher;
