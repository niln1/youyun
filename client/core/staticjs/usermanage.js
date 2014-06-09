/*
 * file: usermanage.js
 * Copyright (c) 2014, Zhihao Ni & Ranchao Zhang. All rights reserved.
 */

"use strict";

var userManageApp = (function () {
    function View() {
        this.$studentTable = $("#student-table");
    }
    View.prototype.start = function () {
        console.log(this.$studentTable);
    };
    View.prototype.getUserList = function () {

    };
    return View;
})();

$(function () {
    var app = new userManageApp();
    app.start();
});