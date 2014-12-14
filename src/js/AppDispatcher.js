"use strict";

var AppDispatcher = {
    callbacks: [],
    register: function (callback) {
        this.callbacks.push(callback);
    },
    handle: function (data) {
        this.callbacks.forEach(function (cb) {
            cb(data);
        });
    }
};

module.exports = AppDispatcher;
